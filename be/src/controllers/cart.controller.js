import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Cart } from "../models/cart.model.js";
import mongoose from "mongoose";
import { Product } from "../models/product.model.js";

const createCart = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        console.log("User is not authenticated");
        throw new ApiError(401, "User is not authenticated")
    }
    const { productId } = req.params;
    if (productId) {
        if (!mongoose.isValidObjectId(productId)) {
            console.log("Product id is invalid");
            throw new ApiError(400, "Product id is invalid")
        }

        const product = await Product.findById(productId);

        if (!product) {
            console.log("Product not found with the give Product id");
            throw new ApiError(404, "Product not found with the give Product id")
        }
        let cart = await Cart.findOne({
            owner: userId
        })

        if (cart) {
            cart.products.push(productId);
            cart.totalPrice += product.price
        }
        else {
            cart = await Cart.create({
                owner: userId,
                products: [productId],
                totalPrice: product.price
            });
        }

        await cart.save();
        return res
            .status(201)
            .json(new ApiResponse(201, cart, "Product added to the cart"))
    }
    //If product is not added and the endpoint hit for the create cart
    const emptyCart = await Cart.create({
        owner: userId
    })

    return res
        .status(201)
        .json(new ApiResponse(201, emptyCart, "Cart created successfully"));
})

const addProductToCart = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { productId } = req.params;
    if (!userId) {
        console.log("User is not authenticated");
        throw new ApiError(401, "User is not authenticated")
    }
    if (!productId) {
        console.log("Prodcut id is required");
        throw new ApiError(400, "Prodcut id is required")
    }
    if (!mongoose.isValidObjectId(productId)) {
        console.log("Product id is invalid");
        throw new ApiError(400, "Product id is invalid")
    }

    const cart = await Cart.findOne({
        owner: userId
    })

    const product = await Product.findById(productId);
    if (!product) {
        console.log("Product is not found");
        throw new ApiError(404, "Product is not found")
    }

    if (cart) {
        cart.products.push(productId);
        cart.totalPrice += product.price;
    }
    else {
        console.log("Cart not found, create it first");
        throw new ApiError(404, "Cart not found, create it first")
    }

    await cart.save();
    return res
        .status(200)
        .json(new ApiResponse(200, cart, "Product added to the cart"))

})

const removeProductFromCart = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { productId } = req.params;
    if (!userId) {
        console.log("User is not authenticated");
        throw new ApiError(401, "User is not authenticated")
    }
    if (!productId) {
        console.log("Prodcut id is required");
        throw new ApiError(400, "Prodcut id is required")
    }
    if (!mongoose.isValidObjectId(productId)) {
        console.log("Product id is invalid");
        throw new ApiError(400, "Product id is invalid")
    }

    const cart = await Cart.findOne({
        owner: userId
    })

    if (!cart) {
        console.log("Cart not found");
        throw new ApiError(404, "Cart not found")
    }

    const product = await Product.findById(productId);
    if (!product) {
        console.log("Product is not found");
        throw new ApiError(404, "Product is not found")
    }

    const productIndex = cart.products.findIndex(p => p.toString() === productId);
    if (productIndex === -1) {
        console.log("Product not found in the cart");
        throw new ApiError(404, "Product not found in the cart")
    }

    cart.products.splice(productIndex, 1);
    cart.totalPrice -= product.price;

    await cart.save();
    return res
        .status(200)
        .json(new ApiResponse(200, cart, "Product removed from the cart"))
})

const removeAllSameProductFromCart = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { productId } = req.params;

    if (!userId) {
        console.log("User is not authenticated");
        throw new ApiError(401, "User is not authenticated")
    }

    if (!productId) {
        console.log("Product id is required");
        throw new ApiError(400, "Product id is required")
    }

    if (!mongoose.isValidObjectId(productId)) {
        console.log("Product id is invalid");
        throw new ApiError(400, "Product id is invalid")
    }

    const product = await Product.findById(productId);
    if (!product) {
        console.log("Product not found");
        throw new ApiError(404, "Product not found")
    }

    const cart = await Cart.findOne({
        owner: userId
    });

    if (!cart) {
        console.log("Cart with the given owner doesn't exist");
        throw new ApiError(404, "Cart with the given owner doesn't exist")
    }

    // Find all instances of the product in the cart
    const productIndexArray = cart.products.filter(productIdInCart => productIdInCart.toString() === productId.toString());

    if (productIndexArray.length > 0) {
        const productDetails = await Product.findById(productId);

        if (productDetails) {
            // Calculate the total price reduction based on the number of occurrences of the product
            const priceToRemove = productDetails.price * productIndexArray.length;

            // Remove the product(s) from the cart by filtering it out
            cart.products = cart.products.filter(productIdInCart => productIdInCart.toString() !== productId.toString());

            // Update the total price of the cart
            cart.totalPrice -= priceToRemove;

            // Ensure the totalPrice is not negative
            if (cart.totalPrice < 0) {
                cart.totalPrice = 0;
            }

            // Save the updated cart
            await cart.save();

            return res.status(200).json(
                new ApiResponse(200, cart, "Product(s) removed from cart successfully")
            );
        } else {
            console.log("Product not found in the Product collection");
            throw new ApiError(404, "Product not found in the Product collection");
        }
    } else {
        console.log("Product not found in the cart");
        throw new ApiError(404, "Product not found in the cart");
    }
});

const deleteCart = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        console.log("User is not authenticated");
        throw new ApiError(401, "User is not authenticated")
    }

    const cart = await Cart.findOneAndDelete({
        owner: userId
    })

    if (!cart) {
        console.log("Cart not found");
        throw new ApiError(404, "Cart not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Cart deleted successfully"))
});

const getCart = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        console.log("User not authorized");
        throw new ApiError(401, "User not authorized")
    }
    const cart = await Cart.findOne({
        owner: userId
    })
    if (!cart) {
        console.log("Cart not found");
        throw new ApiError(404, "Cart not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, cart, "Cart fetched successfully"))
})

export {
    createCart,
    removeAllSameProductFromCart,
    addProductToCart,
    removeProductFromCart,
    deleteCart,
    getCart
}
