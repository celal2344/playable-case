import express from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import {
    createCart,
    removeAllSameProductFromCart,
    addProductToCart,
    removeProductFromCart,
    deleteCart, getCart
} from "../controllers/cart.controller.js"

const router = express.Router();

/**
 * @openapi
 * /cart/create-cart/{productId}:
 *   post:
 *     summary: Create cart and add product
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Cart created
 */
router.route("/create-cart/:productId").post(createCart);

/**
 * @openapi
 * /cart/get-cart:
 *   get:
 *     summary: Get cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart details
 */
router.route("/get-cart").get(getCart);

/**
 * @openapi
 * /cart/remove-same-products/{productId}:
 *   patch:
 *     summary: Remove all same products from cart
 *     tags:
 *       - Cart
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
 *         description: Products removed
 */
router.route("/remove-same-products/:productId").patch(removeAllSameProductFromCart);

/**
 * @openapi
 * /cart/add-product/{productId}:
 *   patch:
 *     summary: Add product to cart
 *     tags:
 *       - Cart
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
 *         description: Product added
 */
router.route("/add-product/:productId").patch(addProductToCart);

/**
 * @openapi
 * /cart/{productId}:
 *   patch:
 *     summary: Remove one product from cart
 *     tags:
 *       - Cart
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
 *         description: Product removed
 *   delete:
 *     summary: Delete cart
 *     tags:
 *       - Cart
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
 *         description: Cart deleted
 */
router.route("/:productId").patch(removeProductFromCart).delete(deleteCart);

export {
    router
}