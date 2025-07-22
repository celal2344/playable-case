import express from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import { checkAdminRole } from "../middlewares/role.middleware.js";
import { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } from "../controllers/category.controller.js";

const router = express.Router();

/**
 * @openapi
 * /category/create-category:
 *   post:
 *     summary: Create category
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Category created
 */
router.route("/create-category").post(checkAdminRole, createCategory);

/**
 * @openapi
 * /category/all-categories:
 *   get:
 *     summary: Get all categories
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category list
 */
router.route("/all-categories").get(getAllCategories);

/**
 * @openapi
 * /category/{categoryId}:
 *   get:
 *     summary: Get category details
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category details
 *   patch:
 *     summary: Update category
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Category updated
 *   delete:
 *     summary: Delete category
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted
 */
router.route("/:categoryId").get(checkAdminRole, getCategoryById).patch(checkAdminRole, updateCategory).delete(checkAdminRole, deleteCategory);

export {
    router
}