const express = require("express");

const {createCategories, getAllCategories, getCategoriesById, updateCategory, deleteCategory} = require("../controllers/categoriesController");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createCategories);

router.get("/", getAllCategories);

router.get("/:id", getCategoriesById);

router.put("/:id", authMiddleware, adminMiddleware, updateCategory);

router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);

module.exports = router;