const express = require('express')

const {getPolicyholder,postPolicyholder,putPolicyholder,deletePolicyholder} = require('../Controller/PolicyholderController')

const router = express.Router()

router.get('/get',getPolicyholder)
router.post('/post',postPolicyholder)
router.put('/put/:id',putPolicyholder)
router.delete('/delete/:id',deletePolicyholder)

module.exports = router