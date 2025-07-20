import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true
}));

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"))
app.use(cookieParser())

//importing ALl routes
import { router as userRouter } from "./routes/user.route.js";
import { router as wishlistRouter } from "./routes/wishlist.route.js";
import { router as reviewRouter } from "./routes/review.route.js";
import { router as productRouter } from "./routes/product.route.js";
import { router as categoryRouter } from "./routes/category.route.js";
import { router as cartRouter } from "./routes/cart.route.js";
import { router as addressRouter } from "./routes/address.route.js";
import { router as healthCheckRouter } from "./routes/healthCheck.route.js";

app.use("/healthCheck", healthCheckRouter);
app.use("/users", userRouter);
app.use("/wishlist", wishlistRouter);
app.use("/review", reviewRouter);
app.use("/product", productRouter);
app.use("/category", categoryRouter);
app.use("/cart", cartRouter);
app.use("/address", addressRouter);

app.use(errorHandler);

export { app }