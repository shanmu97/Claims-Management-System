const express = require('express')

const {getAllPolicies,getPolicy,addPolicy,editPolicy,deletePolicy} = require('../Controller/PolicyController')
const {protect} = require( '../Middleware/authMiddleware')

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Policy:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         type:
 *           type: string
 *           enum: ["Life", "Auto", "Health", "Home", "Travel"]
 *         amount:
 *           type: number
 *         premium:
 *           type: string
 *           enum: ["Monthly", "Quarterly", "Halfyearly", "Annually"]
 *         description:
 *           type: string
 *       required:
 *         - name
 *         - type
 *         - amount
 *         - premium
 *         - description
 */

/**
 * @swagger
 * tags:
 *   - name: Policy
 *     description: Policy related operations
 */

/**
 * @swagger
 * /Policies:
 *   get:
 *     summary: Get all Policies
 *     description: Returns a list of all available policies.
 *     tags: [Policy]
 *     responses:
 *       200:
 *         description: A list of all policies.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /Policies/{id}:
 *   get:
 *     summary: Get a single Policy by ID
 *     description: Returns details of a single policy by its ID.
 *     tags: [Policy]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the policy to retrieve.
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *     responses:
 *       200:
 *         description: A single policy retrieved successfully.
 *       404:
 *         description: Policy not found.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /Policies:
 *   post:
 *     summary: Add a new Policy
 *     description: Creates a new policy and adds it to the system.
 *     tags: [Policy]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Policy'
 *     responses:
 *       201:
 *         description: Policy created successfully.
 *       400:
 *         description: Bad Request.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /Policies/edit/{id}:
 *   put:
 *     summary: Edit an existing Policy
 *     description: Updates the details of an existing policy by ID.
 *     tags: [Policy]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the policy to update.
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Policy'
 *     responses:
 *       200:
 *         description: Policy updated successfully.
 *       400:
 *         description: Bad Request.
 *       404:
 *         description: Policy not found.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /Policies/delete/{id}:
 *   delete:
 *     summary: Delete a Policy
 *     description: Deletes an existing policy by its ID.
 *     tags: [Policy]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the policy to delete.
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *     responses:
 *       200:
 *         description: Policy deleted successfully.
 *       404:
 *         description: Policy not found.
 *       500:
 *         description: Internal Server Error.
 */

router.get('/',getAllPolicies)
router.get('/:id',getPolicy)
router.post('/',protect,addPolicy)
router.put('/edit/:id',protect,editPolicy)
router.delete('/delete/:id',protect,deletePolicy)

module.exports = router