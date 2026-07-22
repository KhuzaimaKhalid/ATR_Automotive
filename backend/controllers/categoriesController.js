const db = require('../config/connectDB');

const createCategories = async (req, res) => {
    try {
        const { name, image } = req.body
        if (!name || !image) {
            return res.status(400).json({ message: "Please provide all required fields" });
        } else {
            const sql = 'INSERT INTO categories (name, image) VALUES (?, ?)';
            const result = db.prepare(sql).run(name, image);

            return res.status(201).json({ message: "Category created successfully", categoryId: result.lastInsertRowid });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

const getAllCategories = async (req, res) => {
    try {
        const sql = 'SELECT * FROM categories';
        const categories = db.prepare(sql).all();

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
        const category = db.prepare(sql).get(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        return res.status(200).json({ category });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

const updateCategory = async (req, res) => {

    try {
        const { id } = req.params;
        const { name, image } = req.body;
        if (!name || !image) {
            return res.status(400).json({ message: "Please provide all required fields" });
        } else {
            const sql = 'UPDATE categories SET name = ?, image = ? WHERE id = ?';
            const result = db.prepare(sql).run(name, image, id);
            if (result.changes === 0) {return res.status(404).json({message: "Category not found"});
            }
            return res.status(200).json({ message: "Category updated successfully" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = 'DELETE FROM categories WHERE id = ?';
        const result = db.prepare(sql).run(id);
        if (result.changes === 0) {
            return res.status(404).json({ message: "Category not found" });
        }
        return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = {
    createCategories,
    getAllCategories,
    getCategoriesById,
    updateCategory,
    deleteCategory
}