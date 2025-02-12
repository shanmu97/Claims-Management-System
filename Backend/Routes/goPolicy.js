const express = require('express')

const {getPolicy,postPolicy,putPolicy,deletePolicy} = require('../Controller/PolicyController')

const router = express.Router()

router.get('/get',getPolicy)
router.post('/post',postPolicy)
router.put('/put/:id',putPolicy)
router.delete('/delete/:id',deletePolicy)

module.exports = router