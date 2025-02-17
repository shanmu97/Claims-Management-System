const express = require('express')
const {protect} = require('../Middleware/authMiddleware')
const {applyPolicy,updatePolicy, getAllPolicyHolders,getAllPolicies} = require('../Controller/PolicyholderController');


const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     PolicyHolder:
 *       type: object
 *       properties:
 *         policyHolderId:
 *           type: string
 *           format: ObjectId
 *         dob:
 *           type: string
 *           format: date
 *         address:
 *           type: string
 *         PAN_NUMBER:
 *           type: string
 *         policies:
 *           type: array
 *           items:
 *             type: string
 *             format: ObjectId
 *         claims:
 *           type: array
 *           items:
 *             type: string
 *             format: ObjectId
 *       required:
 *         - policyHolderId
 *         - dob
 *         - address
 *         - PAN_NUMBER
 */

/**
 * @swagger
 * tags:
 *   - name: Policyholder
 *     description: Policyholder related operations
 */

/**
 * @swagger
 * /Policyholders:
 *   post:
 *     summary: Apply a Policy for a Policyholder
 *     description: Adds a new policy to the given policyholder.
 *     tags: [Policyholder]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PolicyHolder'
 *     responses:
 *       201:
 *         description: Policy applied successfully.
 *       400:
 *         description: Bad Request.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /Policyholders/{id}:
 *   put:
 *     summary: Update a Policyholder's information
 *     description: Updates the details of a specific Policyholder.
 *     tags: [Policyholder]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the Policyholder to update.
 *         required: true
 *         schema:
 *           type: string
 *           format: ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PolicyHolder'
 *     responses:
 *       200:
 *         description: Policyholder updated successfully.
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: Policyholder not found.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /Policyholders:
 *   get:
 *     summary: Get all Policyholders
 *     description: Returns a list of all policyholders.
 *     tags: [Policyholder]
 *     responses:
 *       200:
 *         description: A list of all policyholders.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /Policyholders/policies:
 *   get:
 *     summary: Get all Policies for the authenticated User
 *     description: Returns all the policies associated with the authenticated user.
 *     tags: [Policyholder]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of policies for the user.
 *       401:
 *         description: Unauthorized, invalid token.
 *       500:
 *         description: Internal Server Error.
 */


router.post('/',protect,applyPolicy);
router.put('/:id',protect,updatePolicy);
router.get('/',getAllPolicyHolders);
router.get('/policies',protect,getAllPolicies)


module.exports = router