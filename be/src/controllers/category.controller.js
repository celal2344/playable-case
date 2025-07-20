import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Category } from "../models/category.model.js";

const createCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) {
        console.log("Both fields are required");
        throw new ApiError(400, "Both fields are required")
    }
    const isCategoryAvailable = await Category.findOne({
        name: name
    })
    if (isCategoryAvailable) {
        console.log("Category with the given name already exists");
        throw new ApiError(400, "Category with the given name already exists")
    }
    const category = await Category.create({ name: name, description: description });

    return res
        .status(201)
        .json(new ApiResponse(201, category, "Category created successfully"))
})

const getAllCategories = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    if (page < 1 && limit < 1) {
        console.log("Page and limit cannot be negative");
        throw new ApiError(400, "Page and limit cannot be negative")
    }

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }


    const allCategories = await Category.aggregatePaginate([
        {
            $match: {}
        }
    ], options);

    if (!allCategories.totalPages === 0) {
        console.log("No page found");
        throw new ApiError(404, "No page found ")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {
            data: allCategories.docs,
            totalPages: allCategories.totalPages,
            totalDocuments: allCategories.totalDocs
        }, "All categories fetched successfully"))
})

const getCategoryById = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    if (!categoryId) {
        console.log("Category id is required");
        throw new ApiError(400, "Category id is required")
    }
    if (!mongoose.isValidObjectId(categoryId)) {
        console.log("Category id is invalid");
        throw new ApiError(400, "Category id is invalid")
    }

    const category = await Category.findById(categoryId);
    if (!category) {
        console.log("No category found with the given id");
        throw new ApiError(404, "No category found with the given id")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, category, "Category fetched successfully"))
})

const updateCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    if (!categoryId) {
        console.log("Category id is required");
        throw new ApiError(400, "Category id is required")
    }
    if (!mongoose.isValidObjectId(categoryId)) {
        console.log("Category id is invalid");
        throw new ApiError(400, "Category id is invalid")
    }
    const { name, description } = req.body;
    const changes = {};
    if (name) {
        changes.name = name;
    }
    if (description) {
        changes.description = description;
    }
    if (Object.keys(changes).length === 0) {
        console.log("At least 1 field is required to change");
        throw new ApiError(400, "At least 1 field is required to change")
    }

    const updatedCategory = await Category.findByIdAndUpdate(categoryId, changes, { new: true });
    if (!updatedCategory) {
        console.log("Unable to update the category or category may not exist");
        throw new ApiError(404, "Unable to update the category or category may not exist")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedCategory, "Category updated successfully"))
})

const deleteCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    if (!categoryId) {
        console.log("Category id is required");
        throw new ApiError(400, "Category id is required")
    }
    if (!mongoose.isValidObjectId(categoryId)) {
        console.log("Category id is invalid");
        throw new ApiError(400, "Category id is invalid")
    }

    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
        console.log("Category may not exist");
        throw new ApiError(404, "Category may not exist")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Category deleted successfully"))
})

export {
    createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory
}