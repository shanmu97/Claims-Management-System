const express = require('express')
const {protect} = require('../Middleware/authMiddleware')
const {applyPolicy,updatePolicy, getAllPolicyHolders,getAllPolicies} = require('../Controller/PolicyholderController');


const router = express.Router()

router.post('/',protect,applyPolicy);
router.put('/:id',protect,updatePolicy);
router.get('/',getAllPolicyHolders);
router.get('/policies',protect,getAllPolicies)


module.exports = router