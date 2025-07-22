import express from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import { createReview, updateReview, getReviewByReviewId, getReviewByUserId, deleteReview } from "../controllers/review.controller.js";

const router = express.Router();
/**
 * @openapi
 * /review/create-review/{productId}:
 *   post:
 *     summary: Add review to product
 *     tags:
 *       - Review
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
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Review added
 */
router.route("/create-review/:productId").post(createReview);

/**
 * @openapi
 * /review/{productId}/{reviewId}:
 *   get:
 *     summary: Get review details
 *     tags:
 *       - Review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review details
 *   patch:
 *     summary: Update review
 *     tags:
 *       - Review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: Review updated
 *   delete:
 *     summary: Delete review
 *     tags:
 *       - Review
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted
 */
router.route("/:productId/:reviewId").get(getReviewByReviewId).patch(updateReview).delete(deleteReview)

/**
 * @openapi
 * /review/user-review:
 *   get:
 *     summary: Get user's reviews
 *     tags:
 *       - Review
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User reviews
 */
router.route("/user-review").get(getReviewByUserId);

export {
    router
}
