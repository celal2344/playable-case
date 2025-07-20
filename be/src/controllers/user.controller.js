import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { EmailSend } from "../utils/mailSender.js";

const generateAccessAndRefreshToken = async (userId) => {

    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return {
            accessToken,
            refreshToken
        }

    } catch (error) {
        console.log("Unable to generate refresh and access token");
        throw new ApiError(500, "Unable to generate refresh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password, phoneNumber, role } = req.body;

    if ([fullName, email,  password, phoneNumber].some((field) => field?.trim() === "")) {
        console.log("All field is required");
        throw new ApiError(400, "All field is required")
    }

    const checkUser = await User.findOne({ email: email });
    if (checkUser) {
        console.log("User already exists!");
        throw new ApiError(400, "User already exists!");
    }

    const user = await User.create({
        fullName,
        email,
        password,
        phoneNumber,
        role,
        isEmailVerified: false
    });

    // Email doğrulama için OTP gönder
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 dakika geçerli
    await user.save({ validateBeforeSave: false });

    const subject = "Email Doğrulama OTP";
    const text = `Email doğrulama OTP kodunuz: ${otp}`;
    const html = `<p>Email doğrulama OTP kodunuz: <b>${otp}</b></p>`;

    await EmailSend(email, subject, text, html);

    return res
        .status(201)
        .json(new ApiResponse(201, {}, "Kayıt başarılı! Email doğrulama OTP'si gönderildi. Lütfen emailinizi doğrulayın."));
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        console.log("Email and password required");
        throw new ApiError(400, "Email and password required")
    }

    const user = await User.findOne({ email: email });
    if (!user) {
        console.log("User doesn't exist,Please register");
        throw new ApiError(404, "User doesn't exist,Please register")
    }

    if (!user.isEmailVerified) {
        throw new ApiError(403, "Email doğrulanmadı. Lütfen emailinizi doğrulayın.");
    }

    const isPassValid = await user.isPasswordCorrect(password);

    if (!isPassValid) {
        console.log("Password is wrong,Please enter correct password");
        throw new ApiError(401, "Password is wrong,Please enter correct password")
    }

    // OTP oluştur ve gönder
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 dakika geçerli
    await user.save({ validateBeforeSave: false });

    const subject = "OTP Kodunuz";
    const text = `OTP kodunuz: ${otp}`;
    const html = `<p>OTP kodunuz: <b>${otp}</b></p>`;

    await EmailSend(email, subject, text, html);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "OTP gönderildi, lütfen OTP ile giriş yapın."));
})

const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        console.log("user is not authenticated");
        throw new ApiError(400, "user is not authenticated")
    }
    await User.findByIdAndUpdate(userId, {
        $unset: {
            refreshToken: 1
        }
    }, { new: true });

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User details fetched successfully"))
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        console.log("Refresh token is not recieved!");
        throw new ApiError(400, "Refresh token is not recieved!")
    }
    const decode = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
    if (!decode) {
        console.log("Invalid Refresh token");
        throw new ApiError(400, "Invalid Refresh token")
    }
    const user = await User.findById(decode?._id).select("-phoneNumber -password");
    if (!user) {
        console.log("User doesn't exist or invalid refresh token");
        throw new ApiError(404, "User doesn't exist or invalid refresh token")
    }
    if (incomingRefreshToken !== user?.refreshToken) {
        console.log("Refresh token is expired or Invalid");
        throw new ApiError(401, "Refresh token is expired or Invalid")
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {
            user, accessToken, refreshToken
        }, "Access token is refreshed "))
})

const updatePasword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!newPassword || !oldPassword) {
        console.log("Old and new password is required");
        throw new ApiError(400, "Old and new password is required")
    }

    const userId = req.user?._id;
    if (!userId) {
        console.log("User is not authenticated");
        throw new ApiError(400, "User is not authenticated")
    }

    const user = await User.findById(userId);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        console.log("Password is invalid");
        throw new ApiError(400, "Password is invalid")
    }

    user.password = newPassword;
    await user.save({
        validateBeforeSave: false
    })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password updated successfully"))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, phoneNumber } = req.body;
    const changes = {};
    if (fullName) {
        changes.fullName = fullName;
    }
    if (phoneNumber) {
        changes.phoneNumber = phoneNumber;
    }
    if (!fullName && !phoneNumber) {
        console.log("At least 1 field is required for the update");
        throw new ApiError(400, "At least 1 field is required for the update")
    }
    const userId = req.user?._id;
    if (!userId) {
        console.log("User is not authenticated");
        throw new ApiError("User is not authenticated")
    }
    const updatedUser = await User.findByIdAndUpdate(userId, changes, { new: true }).select("-phoneNumber -password");
    if (!updatedUser) {
        console.log("unable to update the details");
        throw new ApiError(400, "unable to update the details");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "Details updated successfully"))

})

const updateUserRole = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        console.log("User id is required");
        throw new ApiError(400, "User id is required")
    }
    if (!mongoose.isValidObjectId(userId)) {
        console.log("User id is invalid");
        throw new ApiError(400, "User id is invalid")
    }

    const updateRole = await User.findByIdAndUpdate(userId, {
        role: "Admin"
    }, { new: true })

    if (!updateUserRole) {
        console.log("User with the given id not found");
        throw new ApiError(404, "User with the given id not found")
    }
    return res
        .status(200)
        .json(new ApiResponse(200, updateRole, "User role update successfully"))
})

const sendOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new ApiError(400, "Email is required");
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 dakika geçerli
    await user.save({ validateBeforeSave: false });

    const subject = "OTP";
    const text = `Your OTP Code: ${otp}`;
    const html = `<p>OTP kodunuz: <b>${otp}</b></p>`;

    try {
        await EmailSend(email, subject, text, html);
    } catch (error) {
        throw new ApiError(500, "OTP gönderilemedi");
    }

    return res.status(200).json(new ApiResponse(200, {}, "OTP gönderildi"));
});

const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        throw new ApiError(400, "Email ve OTP gereklidir");
    }
    const user = await User.findOne({ email });
    if (!user || !user.otp || !user.otpExpires) {
        throw new ApiError(400, "OTP bulunamadı");
    }
    if (user.otp !== otp) {
        throw new ApiError(400, "OTP yanlış");
    }
    if (Date.now() > user.otpExpires) {
        throw new ApiError(400, "OTP süresi doldu");
    }

    // Eğer email do��rulama yapılmadıysa, email doğrulamasını tamamla
    if (!user.isEmailVerified) {
        user.isEmailVerified = true;
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // Eğer login için doğrulama ise tokenları üret ve gönder
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken -phoneNumber");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {
            user: loggedInUser,
            accessToken: accessToken,
            refreshToken: refreshToken
        }, "OTP doğrulandı, giriş başarılı"));
});

export {
    registerUser, loginUser, getCurrentUser, logoutUser,
    updatePasword, refreshAccessToken, updateAccountDetails,
    updateUserRole, sendOtp, verifyOtp
}