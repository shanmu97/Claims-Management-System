const express = require('express')

const {getPayment,postPayment,putPayment,deletePayment} = require('../Controller/PaymentController')

const router = express.Router()

router.get('/get',getPayment)
router.post('/post',postPayment)
router.put('/put/:id',putPayment)
router.delete('/delete/:id',deletePayment)

module.exports = router