const express = require('express');
const { getClaim, postClaim, putClaim, deleteClaim } = require('../Controller/ClaimsController');

const router = express.Router();

router.get('/get', getClaim);
router.post('/post', postClaim);
router.put('/put/:id', putClaim);
router.delete('/delete/:id', deleteClaim);

module.exports = router;
