const express = require('express');
const {protect} = require('../Middleware/authMiddleware')
const {applyClaim,updateClaim,getAllClaims} = require('../Controller/ClaimsController')

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Claim:
 *       type: object
 *       properties:
 *         policyId:
 *           type: string
 *           format: ObjectId
 *         policyholderId:
 *           type: string
 *           format: ObjectId
 *         status:
 *           type: string
 *           enum: ["Applied", "Pending", "Approved", "Rejected"]
 *         claimAmount:
 *           type: number
 *         appliedDate:
 *           type: string
 *           format: date-time
 *         approvedAmount:
 *           type: number
 *         reasonForClaim:
 *           type: string
 *           enum: ["Medical", "Accident", "Theft", "Natural Disaster", "Other"]
 *         updatedDate:
 *           type: string
 *           format: date-time
 *       required:
 *         - policyId
 *         - policyholderId
 *         - status
 *         - claimAmount
 *         - reasonForClaim
 *         - appliedDate
 */

/**
 * @swagger
 * tags:
 *   - name: Claim
 *     description: Claim related operations
 */

/**
 * @swagger
 * /Claims:
 *   post:
 *     summary: Apply for a Claim
 *     description: Apply a new claim for a policyholder.
 *     tags: [Claim]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Claim'
 *     responses:
 *       201:
 *         description: Claim applied successfully.
 *       400:
 *         description: Bad Request.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /Claims/{id}:
 *   put:
 *     summary: Update a Claim
 *     description: Update an existing claim by its ID.
 *     tags: [Claim]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the claim to update.
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Claim'
 *     responses:
 *       200:
 *         description: Claim updated successfully.
 *       400:
 *         description: Bad Request.
 *       404:
 *         description: Claim not found.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /Claims:
 *   get:
 *     summary: Get all Claims
 *     description: Retrieve a list of all claims.
 *     tags: [Claim]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of claims.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/',protect,applyClaim)
router.put('/:id',updateClaim)
router.get('/',protect,getAllClaims)

module.exports = router;
