const db = require('../config/connectDB');
const { put, del } = require('@vercel/blob');

const createCategories = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !req.file) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const blob = await put(`categories/${Date.now()}-${req.file.originalname}`, req.file.buffer, {
            access: 'public',
            addRandomSuffix: true,
            token: process.env.BLOB_READ_WRITE_TOKEN
        });

        const sql = 'INSERT INTO categories (name, image) VALUES (?, ?)';
        const result = await db.prepare(sql).run(name, blob.url);

        return res.status(201).json({ 
            message: "Category created successfully", 
            categoryId: Number(result.lastInsertRowid), 
            image: blob.url 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        
        if (!name) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }
        const existing = await db.prepare('SELECT image FROM categories WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({ message: "Category not found" });
        }
        let imageUrl = existing.image;
        if (req.file) {
            if (existing.image && existing.image.includes('blob.vercel-storage.com')) {
                await del(existing.image, { token: process.env.BLOB_READ_WRITE_TOKEN });
            }
            const blob = await put(`categories/${Date.now()}-${req.file.originalname}`, req.file.buffer, {
                access: 'public',
                addRandomSuffix: true
            });
            imageUrl = blob.url;
        }
        const sql = 'UPDATE categories SET name = ?, image = ? WHERE id = ?';
        const result = await db.prepare(sql).run(name, imageUrl, id);
        if (result.changes === 0) {
            return res.status(404).json({ message: "Category not found" });
        }
        return res.status(200).json({ message: "Category updated successfully", image: imageUrl });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const sql = 'SELECT * FROM categories';
        const categories = await db.prepare(sql).all();
        if (categories.length === 0) {
            return res.status(404).json({ message: "No categories found" });
        }
        return res.status(200).json({ categories });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getCategoriesById = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = 'SELECT * FROM categories where id = ?';
        const category = await db.prepare(sql).get(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        return res.status(200).json({ category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await db.prepare('SELECT image FROM categories WHERE id = ?').get(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        if (category.image && category.image.includes('blob.vercel-storage.com')) {
            await del(category.image, { token: process.env.BLOB_READ_WRITE_TOKEN });
        }
        await db.prepare('DELETE FROM categories WHERE id = ?').run(id);
        return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    createCategories,
    getAllCategories,
    getCategoriesById,
    updateCategory,
    deleteCategory
};