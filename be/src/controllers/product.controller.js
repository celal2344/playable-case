import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Category } from "../models/category.model.js";

const productListing = asyncHandler(async (req, res) => {

    const { categoryId } = req.params;
    const { name, description, price, stock, brand } = req.body;
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
        console.log("Category with the give id doesn't exist");
        throw new ApiError(404, "Category with the give id doesn't exist")
    }
    if ([name, description, price, brand].some((field) => field?.trim() === "")) {
        console.log("All fields are required");
        throw new ApiError(400, "All fields are required")
    }

    const adminId = req.user?._id;

    if (!adminId) {
        console.log("Admin is not authenticated");
        throw new ApiError(401, "Admin is not authenticated")
    }

    const productImagesPath = req.files.map(file => file.path);

    if (!productImagesPath || productImagesPath.length === 0) {
        console.log("At least one image is required");
        throw new ApiError(400, "At least one image is required")
    }
    const uploadedImagesUrl = []
    const imagesPublicIdFromCloudinary = []

    for (const file of productImagesPath) {
        const uploadProductImagesOnCloudinary = await uploadOnCloudinary(file);
        uploadedImagesUrl.push(uploadProductImagesOnCloudinary.url);
        imagesPublicIdFromCloudinary.push(uploadProductImagesOnCloudinary.public_id);
    }

    const listProduct = await Product.create({
        seller: adminId,
        name: name,
        description: description,
        price: price,
        stock: stock,
        brand: brand,
        images: uploadedImagesUrl,
        imagesPublicId: imagesPublicIdFromCloudinary,
        category: categoryId
    })

    const product = await Product.findById(listProduct._id).populate("category").select("seller name description price stock brand images category");
    if (!product) {
        console.log("Unable to list the product");
        throw new ApiError(400, "Unable to list the product")
    }

    return res
        .status(201)
        .json(new ApiResponse(201, product, "Product listed successfully"))
})

const getProductById = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    if (!productId) {
        console.log("Product id is required");
        throw new ApiError(400, "Product id is required")
    }
    if (!mongoose.isValidObjectId(productId)) {
        console.log("Product id is invalid");
        throw new ApiError(400, "Product id is invalid")
    }
    const getProduct = await Product.findById(productId).select("-imagesPublicId -review");
    if (!getProduct) {
        console.log("Product doesn't exist");
        throw new ApiError(404, "Product doesn't exist")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, getProduct, "Product Fetched successfully"))
})

const updateListedProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    if (!productId) {
        console.log("Product id is required");
        throw new ApiError(400, "Product id is required")
    }
    if (!mongoose.isValidObjectId(productId)) {
        console.log("product id is invalid");
        throw new ApiError(400, "product id is invalid")
    }

    const allowedFields = ['name', 'description', 'price', 'stock', 'brand'];
    const updateChanges = {};
    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            updateChanges[field] = req.body[field];
        }
    });
    if (Object.keys(updateChanges).length === 0) {
        console.log("At least 1 field is required");
        throw new ApiError(400, "At least 1 field is required")
    }

    const updateProduct = await Product.findByIdAndUpdate(productId, updateChanges, { new: true }).populate("category").select("seller name description price stock brand images category");
    if (!updateProduct) {
        console.log("Unable to update the product");
        throw new ApiError(400, "Unable to update the product")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updateProduct, "Product update successfully"))
})

const changeProductCategory = asyncHandler(async (req, res) => {
    const { categoryId, productId } = req.params;
    if (!categoryId || !productId) {
        console.log("Category id and product id both are required");
        throw new ApiError(400, "Category id and product id both are required");
    }
    if (!mongoose.isValidObjectId(categoryId) || !mongoose.isValidObjectId(productId)) {
        console.log("Either category id or product id is invalid");
        throw new ApiError(400, "Either category id or product id is invalid")
    }
    const updateCategory = await Product.findByIdAndUpdate(productId, { category: categoryId }, { new: true }).populate("category").select("seller name description price stock brand images category");
    if (!updateCategory) {
        console.log("Unable to update the category");
        throw new ApiError(400, "Unable to update the category")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updateCategory, "Product category Updated Successfully"))
})

const updateProductImages = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    if (!productId) {
        console.log("Product Id is required");
        throw new ApiError(400, "Product Id is required")
    }
    if (!mongoose.isValidObjectId(productId)) {
        console.log("Product id is invalid");
        throw new ApiError(400, "Product id is invalid")
    }
    const product = await Product.findById(productId);
    const images = req.files.map(file => file.path);

    if (((product.images).length + images.length) > 11) {
        console.log("Only 10 images are allowed for a single prodcut");
        throw new ApiError(400, "Only 10 images are allowed for a single prodcut")
    }
    const uploadedImagesUrl = [];
    const uploadedImagesPublicId = [];
    for (const filePath of images) {
        const uploadFileImagesOnCloudinary = await uploadOnCloudinary(filePath);
        uploadedImagesUrl.push(uploadFileImagesOnCloudinary.url);
        uploadedImagesPublicId.push(uploadFileImagesOnCloudinary.public_id)
    }

    const updatedImages = await Product.findByIdAndUpdate(productId, {
        $push: {
            images: { $each: uploadedImagesUrl },
            imagesPublicId: { $each: uploadedImagesPublicId }
        }
    }, {
        new: true
    })
    if (!updatedImages) {
        console.log("Unable to update images");
        throw new ApiError(400, "Unable to update images")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedImages, "Images updated successfully"))
})

const deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    if (!productId) {
        console.log("product id is required");
        throw new ApiError(400, "product id is required")
    }
    if (!mongoose.isValidObjectId(productId)) {
        console.log("product id is invalid");
        throw new ApiError(400, "product id is invalid")
    }
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
        console.log("product is not deleted successfully or product not found");
        throw new ApiError(400, "product is not deleted successfully or product not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Product deleted Successfully"))
})

const getProducts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, name, category, brand, minPrice, maxPrice, sortBy } = req.query;

    if (page < 1 && limit < 1) {
        console.log("Page and limit cannot be negative");
        throw new ApiError(400, "Page and limit cannot be negative")
    }

    const skip = (page - 1) * limit;

    const filter = {};

    if (name) filter.name = { $regex: name, $options: 'i' };
    if (category) filter.category = mongoose.Types.ObjectId(category);
    if (brand) filter.brand = brand;
    if (minPrice) filter.price = { $gte: minPrice };
    if (maxPrice) {
        if (!filter.price) filter.price = {};
        filter.price = { ...filter.price, $lte: maxPrice };
    }
    const sort = {};
    if (sortBy) {
        const [field, order] = sortBy.split(':');
        if (['name', 'price'].includes(field) && ['asc', 'desc'].includes(order)) {
            sort[field] = order === 'desc' ? -1 : 1;
        } else if (field === "rating") {
            sort = { 'averageRating': order === desc ? -1 : 1 };
        }
        else {
            console.log("Invalid Sorting filter");
            throw new ApiError(400, "Invalid Sorting filter")
        }
    }
    else {
        sort.name = 1;
    }
    const products = await Product.aggregate([
        {
            $match: filter
        },
        {
            $lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'productId',
                as: 'reviews'
            }
        },
        {
            $addFields: {
                averageRating: {
                    $ifNull: [{ $avg: '$reviews.rating' }, 0]
                }
            }
        },
        {
            $sort: sort
        },
        {
            $skip: skip
        },
        {
            $limit: limit
        }, {
            $project: {
                name: 1,
                seller: 1,
                description: 1,
                price: 1,
                stock: 1,
                category: 1,
                brand: 1,
                images: 1,
                review: 1
            }
        }
    ])

    if (products.length === 0) {
        console.log("No products were found with the given filter");
        throw new ApiError(404, "No products were found with the given filter")
    }

    const totalProducts = await Product.countDocuments(filter);

    return res
        .status(200)
        .json(new ApiResponse(200, {
            products,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalProducts / limit),
                totalProducts,
                limit
            }
        }))
})

export { productListing, getProductById, getProducts, deleteProduct, changeProductCategory, updateListedProduct, updateProductImages }