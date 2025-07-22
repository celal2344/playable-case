import express from "express";
import { healthCheckController } from "../controllers/healthCheck.controller.js";

const router = express.Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Server health check
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Server is running
 */
router.route("/").get(healthCheckController);

export {
    router
}