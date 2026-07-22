const db = require('../config/connectDB');

const generateInvoiceNo = () => {
    const sql = 'SELECT id FROM sales ORDER BY id DESC LIMIT 1';
    const last = db.prepare(sql).get();
    const nextId = last ? last.id + 1 : 1;
    return `INV-${String(nextId).padStart(5, '0')}`;
}

const generateReturnNo = () => {
    const sql = `SELECT id FROM returns ORDER BY id DESC LIMIT 1`;

    const last = db.prepare(sql).get();
    const nextId = last ? last.id + 1 : 1;

    return `RE-${String(nextId).padStart(5, "0")}`;
};

const createSale = async (req, res) => {
    try {
        const { items, labor_charges, paid_amount } = req.body;
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Please provide sale items' });
        }
        if (paid_amount === undefined) {
            return res.status(400).json({ message: 'Please provide paid amount' });
        }

        let subtotal = 0;
        for (const item of items) {
            const product = db.prepare(
                "SELECT stock_quantity FROM products WHERE id = ?"
            ).get(item.product_id);
            
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            
            if (item.qty > product.stock_quantity) {
                return res.status(400).json({
                    message: "Insufficient stock"
                });
            }
            if (!item.product_id || !item.qty || !item.price) {
                return res.status(400).json({ message: 'Each item must have product_id, qty and price' });
            }
            subtotal += item.qty * item.price;
        }

        const labor = labor_charges || 0;
        const total = subtotal + labor;
        const change = paid_amount - total;

        if (change < 0) {
            return res.status(400).json({ message: 'Paid amount is less than total' });
        }

        const invoice_no = generateInvoiceNo();

        const insertSale = db.prepare(
            'INSERT INTO sales (invoice_no, subtotal, labor_charges, total, paid_amount, change, created_by) VALUES (?,?,?,?,?,?,?)'
        );
        const insertItem = db.prepare(
            'INSERT INTO sale_items (sale_id, product_id, qty, price) VALUES (?,?,?,?)'
        );
        const updateStock = db.prepare(
            'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?'
        );

        const transaction = db.transaction(() => {
            const saleResult = insertSale.run(invoice_no, subtotal, labor, total, paid_amount, change, req.user?.id);
            const sale_id = saleResult.lastInsertRowid;
            for (const item of items) {
                insertItem.run(sale_id, item.product_id, item.qty, item.price);
                updateStock.run(item.qty, item.product_id);
            }
            return sale_id;
        });

        const sale_id = transaction();

        return res.status(201).json({
            message: 'Sale created successfully',
            sale_id,
            invoice_no,
            subtotal,
            labor_charges: labor,
            total,
            paid_amount,
            change
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const getAllSales = async (req, res) => {
    try {
        const sql = 'SELECT * FROM sales ORDER BY created_at DESC';
        const sales = db.prepare(sql).all();
        return res.status(200).json(sales);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const getSaleById = async (req, res) => {
    try {
        const { id } = req.params;
        const sale = db.prepare('SELECT * FROM sales WHERE id = ?').get(id);
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        const items = db.prepare(
            `SELECT sale_items.id, sale_items.product_id, products.name, sale_items.qty, sale_items.price
             FROM sale_items JOIN products ON sale_items.product_id = products.id
             WHERE sale_items.sale_id = ?`
        ).all(id);
        return res.status(200).json({ sale, items });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const searchSaleByInvoice = async (req, res) => {
    try {
        const { invoice_no } = req.query;
        if (!invoice_no) {
            return res.status(400).json({ message: 'Please provide invoice number' });
        }
        const sql = 'SELECT * FROM sales WHERE invoice_no LIKE ?';
        const sales = db.prepare(sql).all(`%${invoice_no}%`);
        return res.status(200).json(sales);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const getSalesByDateRange = async (req, res) => {
    try {
        const { from, to } = req.query;
        if (!from || !to) {
            return res.status(400).json({ message: 'Please provide from and to dates' });
        }
        const sql = 'SELECT * FROM sales WHERE date(created_at) BETWEEN date(?) AND date(?) ORDER BY created_at DESC';
        const sales = db.prepare(sql).all(from, to);
        return res.status(200).json(sales);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

const getSaleByInvoice = async (req, res) => {
    try {
        const { invoice_no } = req.params;

        const sale = db.prepare(
            'SELECT * FROM sales WHERE invoice_no = ?'
        ).get(invoice_no);

        if (!sale) {
            return res.status(404).json({
                message: 'Sale not found'
            });
        }

        const items = db.prepare(`
            SELECT
                sale_items.id,
                sale_items.product_id,
                products.name,
                products.image,
                sale_items.qty,
                sale_items.price,
                (sale_items.qty * sale_items.price) AS subtotal
            FROM sale_items
            JOIN products
            ON sale_items.product_id = products.id
            WHERE sale_items.sale_id = ?
        `).all(sale.id);

        return res.status(200).json({
            sale,
            items
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server error'
        });
    }
};

const deleteSale = async (req, res) => {
    try {
        const { id } = req.params;

        const sale = db.prepare(
            "SELECT * FROM sales WHERE id = ?"
        ).get(id);

        if (!sale) {
            return res.status(404).json({
                message: "Sale not found"
            });
        }

        const saleItems = db.prepare(
            "SELECT product_id, qty FROM sale_items WHERE sale_id = ?"
        ).all(id);

        const restoreStock = db.prepare(
            "UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?"
        );

        const deleteItems = db.prepare(
            "DELETE FROM sale_items WHERE sale_id = ?"
        );

        const deleteSaleQuery = db.prepare(
            "DELETE FROM sales WHERE id = ?"
        );

        const transaction = db.transaction(() => {

            for (const item of saleItems) {
                restoreStock.run(item.qty, item.product_id);
            }

            deleteItems.run(id);
            deleteSaleQuery.run(id);
        });

        transaction();

        return res.status(200).json({
            message: "Sale deleted successfully"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    createSale,
    getAllSales,
    getSaleById,
    searchSaleByInvoice,
    getSalesByDateRange,
    getSaleByInvoice,
    deleteSale
}