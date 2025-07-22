import express from "express";
import { jwtVerify } from "../middlewares/auth.middleware.js";
import {
    addAddress, updateAddress, getAddressById, getAllAddressOfUser, deleteAddress
} from "../controllers/address.controller.js";

const router = express.Router();
router.use(jwtVerify);

/**
 * @openapi
 * /address/add-address:
 *   post:
 *     summary: Add address
 *     tags:
 *       - Address
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       201:
 *         description: Address successfully added
 */
router.route("/add-address").post(addAddress);

/**
 * @openapi
 * /address/all-user-address:
 *   get:
 *     summary: Get all addresses of the user
 *     tags:
 *       - Address
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Address list
 */
router.route("/all-user-address").get(getAllAddressOfUser)

/**
 * @openapi
 * /address/{addressId}:
 *   get:
 *     summary: Get address details
 *     tags:
 *       - Address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address details
 *   patch:
 *     summary: Update address
 *     tags:
 *       - Address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Address'
 *     responses:
 *       200:
 *         description: Address updated
 *   delete:
 *     summary: Delete address
 *     tags:
 *       - Address
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address deleted
 */
router.route("/:addressId").get(getAddressById).patch(updateAddress).delete(deleteAddress);

export {
    router
}