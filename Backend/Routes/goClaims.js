const express = require('express');
const {protect} = require('../Middleware/authMiddleware')
const {applyClaim,updateClaim,getAllClaims} = require('../Controller/ClaimsController')

const router = express.Router();

router.post('/',protect,applyClaim)
router.put('/:id',updateClaim)
router.get('/',protect,getAllClaims)

module.exports = router;
