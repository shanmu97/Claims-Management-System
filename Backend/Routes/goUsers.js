const express = require('express');
const { registerUser,loginUser,getUser,editUser } = require('../Controller/UserController');
const {protect} = require('../Middleware/authMiddleware')

const router = express.Router();


router.post('/',registerUser)
router.post('/login',loginUser)
router.get('/me',protect, getUser)
router.put('/edit',protect,editUser)

module.exports = router;
