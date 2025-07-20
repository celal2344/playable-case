import { Review } from "../models/review.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";
import { Product } from "../models/product.model.js";

const createReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    if (!rating && !comment) {
        console.log("Comment and rating both are required");
        throw new ApiError(400, "Comment and rating both are required")
    }
    const { productId } = req.params;
    if (!productId) {
        console.log("Product id is required");
        throw new ApiError(400, "Product id is required")
    }
    if (!mongoose.isValidObjectId(productId)) {
        console.log("Product id is invalid");
        throw new ApiError(400, "Product id is invalid")
    }
    const userId = req.user?._id;
    if (!userId) {
        console.log("User is not authenticated");
        throw new ApiError(401, "User is not authenticated")
    }

    const review = await Review.create({
        owner: userId,
        rating: rating,
        comment: comment
    })
    const product = await Product.findByIdAndUpdate(productId, {
        review: review._id
    }, {
        new: true
    }).select("-imagesPublicId")
    if (!product) {
        console.log("product not found with the given product id");
        throw new ApiError(400, "product not found with the given product id")
    }

    return res
        .status(201)
        .json(new ApiResponse(201, { review, product }, "Review created successfully"))
})

const updateReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const changes = {};
    if (rating) {
        changes.rating = rating;
    }
    if (comment) {
        changes.comment = comment;
    }
    if (!rating && !comment) {
        console.log("Comment or rating any one of the field is required to be updated.");
        throw new ApiError(400, "Comment or rating any one of the field is required to be updated.")
    }
    const { reviewId } = req.params;
    if (!reviewId) {
        console.log("Review id is required");
        throw new ApiError(400, "Review id is required")
    }
    if (!mongoose.isValidObjectId(reviewId)) {
        console.log("Review id is invalid");
        throw new ApiError(400, "Review id is invalid")
    }
    const { productId } = req.params;
    if (!productId) {
        console.log("Product id is required");
        throw new ApiError(400, "Product id is required")
    }
    if (!mongoose.isValidObjectId(productId)) {
        console.log("Product id is invalid");
        throw new ApiError(400, "Product id is invalid")
    }
    const review = await Review.findByIdAndUpdate(reviewId, changes, { new: true }).select("-imagesPublicId");

    if (!review) {
        console.log("Review for the given id doesn't exist");
        throw new ApiError(404, "Review for the given id doesn't exist")
    }

    const product = await Product.findByIdAndUpdate(productId, {
        review: review._id
    }, {
        new: true
    })
    if (!product) {
        console.log("product not found with the given product id");
        throw new ApiError(400, "product not found with the given product id")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { product, review }, "Review updated successfully"))
})

const getReviewByReviewId = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    if (!reviewId) {
        console.log("Review id is required");
        throw new ApiError(400, "Review id is required")
    }
    if (!mongoose.isValidObjectId(reviewId)) {
        console.log("Review id is invalid");
        throw new ApiError(400, "Review id is invalid")
    }

    const review = await Review.findById(reviewId);

    if (!review) {
        console.log("Review for the given id doesn't exist");
        throw new ApiError(404, "Review for the given id doesn't exist")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, review, "Review fetched successfully"))
})

const getReviewByUserId = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        console.log("User is not authenticated");
        throw new ApiError(401, "User is not authenticated")
    }
    const review = await Review.find({
        owner: userId
    })

    if (!review) {
        console.log("Review for the given id doesn't exist");
        throw new ApiError(404, "Review for the given id doesn't exist")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, review, "Review fetched successfully"))
})

const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    if (!reviewId) {
        console.log("Review id is required");
        throw new ApiError(400, "Review id is required")
    }
    if (!mongoose.isValidObjectId(reviewId)) {
        console.log("Review id is invalid");
        throw new ApiError(400, "Review id is invalid")
    }

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
        console.log("Review for the given id doesn't exist");
        throw new ApiError(404, "Review for the given id doesn't exist")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Review deleted successfully"))
})

export {
    createReview, updateReview, getReviewByReviewId, getReviewByUserId, deleteReview
}