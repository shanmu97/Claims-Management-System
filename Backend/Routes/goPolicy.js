const express = require('express')

const {getAllPolicies,getPolicy,addPolicy,editPolicy,deletePolicy} = require('../Controller/PolicyController')
const {protect} = require( '../Middleware/authMiddleware')

const router = express.Router()

router.get('/',getAllPolicies)
router.get('/:id',getPolicy)
router.post('/',protect,addPolicy)
router.put('/edit/:id',protect,editPolicy)
router.delete('/delete/:id',protect,deletePolicy)

module.exports = router