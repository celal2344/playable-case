import express from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import {
    createWishlist, addProductToWishlist,
    getWishlistById, removeProductFromWishlist, deleteWishlist
} from "../controllers/wishlist.controller.js"

const router = express.Router();
router.use(jwtVerify);

/**
 * @openapi
 * /wishlist/create-wishlist/{productId}:
 *   post:
 *     summary: Create new wishlist and add product
 *     tags:
 *       - Wishlist
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
 *         description: Wishlist created
 */
router.route("/create-wishlist/:productId").post(createWishlist);

/**
 * @openapi
 * /wishlist/add-product-wishlist/{productId}:
 *   patch:
 *     summary: Add product to wishlist
 *     tags:
 *       - Wishlist
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
router.route("/add-product-wishlist/:productId").patch(addProductToWishlist)

/**
 * @openapi
 * /wishlist/{wishlistId}/{productId}:
 *   patch:
 *     summary: Remove product from wishlist
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: wishlistId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product removed
 *   get:
 *     summary: Get wishlist details
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: wishlistId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Wishlist details
 *   delete:
 *     summary: Delete wishlist
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: wishlistId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Wishlist deleted
 */
router.route("/:wishlistId/:productId").patch(removeProductFromWishlist).get(getWishlistById).delete(deleteWishlist)

export { router }