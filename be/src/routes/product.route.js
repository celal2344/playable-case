import express from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import { checkAdminRole } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    productListing, getProductById, getProducts,
    deleteProduct, changeProductCategory,
    updateListedProduct, updateProductImages
} from "../controllers/product.controller.js";

const router = express.Router();

/**
 * @openapi
 * /product/product-listing/{categoryId}:
 *   post:
 *     summary: Add product (admin)
 *     tags:
 *       - Product
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product added
 */
router.route("/product-listing/:categoryId").post(checkAdminRole, upload.array('productImages', 10), productListing);

/**
 * @openapi
 * /product/get-product/{productId}:
 *   get:
 *     summary: Get product details
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 */
router.route("/get-product/:productId").get(getProductById);

/**
 * @openapi
 * /product/update-product/{productId}:
 *   patch:
 *     summary: Update product (admin)
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated
 */
router.route("/update-product/:productId").patch(checkAdminRole, updateListedProduct);

/**
 * @openapi
 * /product/update-product-images/{productId}:
 *   patch:
 *     summary: Update product images (admin)
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images updated
 */
router.route("/update-product-images/:productId").patch(checkAdminRole, upload.array('productImages', 10), updateProductImages);

/**
 * @openapi
 * /product/get-all-products:
 *   get:
 *     summary: Get all products
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Product list
 */
router.route("/get-all-products").get(getProducts)

/**
 * @openapi
 * /product/change-product-category/{productId}/{categoryId}:
 *   patch:
 *     summary: Change product category (admin)
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category changed
 */
router.route("/change-product-category/:productId/:categoryId").patch(checkAdminRole, changeProductCategory);

/**
 * @openapi
 * /product/delete-product/{productId}:
 *   delete:
 *     summary: Delete product (admin)
 *     tags:
 *       - Product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 */
router.route("/delete-product/:productId").delete(checkAdminRole, deleteProduct);

export {
    router
}