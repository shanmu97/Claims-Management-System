const express = require('express');
const { registerUser,loginUser,getUser,editUser } = require('../Controller/UserController');
const {protect} = require('../Middleware/authMiddleware')

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *           enum: ["policyholder", "admin", "agent"]
 *       required:
 *         - name
 *         - email
 *         - phone
 *         - password
 *         - role
 */

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User related operations
 */

/**
 * @swagger
 * /Users:
 *   post:
 *     summary: Create a new User
 *     description: Adds a new User to the database.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully.
 *       400:
 *         description: Bad Request.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /Users/login:
 *   post:
 *     summary: Login User
 *     description: Authenticates a User and returns a JWT token.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successfully logged in.
 *       400:
 *         description: Invalid credentials.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /Users/me:
 *   get:
 *     summary: Get the current logged-in User
 *     description: Returns the details of the currently authenticated User.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved successfully.
 *       401:
 *         description: Unauthorized, invalid token.
 *       500:
 *         description: Internal Server Error.
 */

/**
 * @swagger
 * /Users/edit:
 *   put:
 *     summary: Edit User details
 *     description: Edits the details of the currently authenticated User.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User details updated successfully.
 *       400:
 *         description: Bad Request.
 *       401:
 *         description: Unauthorized, invalid token.
 *       500:
 *         description: Internal Server Error.
 */

router.post('/',registerUser)
router.post('/login',loginUser)
router.get('/me',protect, getUser)
router.put('/edit',protect,editUser)

module.exports = router;
