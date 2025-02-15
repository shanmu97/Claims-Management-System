const asyncHandler = require('express-async-handler')
const Policy = require('../Model/policyModel')

const getAllPolicies=asyncHandler(async (req,res)=>{
    const policies = await Policy.find()
    res.status(200).json({policies: policies})
})

const getPolicy=asyncHandler(async (req,res)=>{
    const id = req.params.id 
    const policy = await Policy.findById(id)
    if(policy){
        res.status(200).json(policy)
    }else{
        res.status(404)
        throw new Error("Policy not exist")
    }
})

const addPolicy = asyncHandler(async(req,res)=>{
    if (req.user.role !== 'agent') {
        res.status(403);
        throw new Error("Unauthorized: Only agents can delete policies.");
    }
    const{name,type,amount,premium,description} = req.body

    const existingPolicy= await Policy.findOne({
        name:req.body.name,
        type:req.body.type,
        amount:req.body.amount,
        premium:req.body.premium,
        description:req.body.description
    })
    if(existingPolicy){
        res.status(400)
        throw new Error("Policy already exists.")
        return
    }
    if(amount<=0){
        res.status(400)
        throw new Error("Enter correct amount")
    }
    if(!name || !type || isNaN(amount) || !premium || !description){
        res.status(400)
        throw new Error("Enter all fields")
    }
    const policy  = Policy.create({
        name,type,amount,premium,description
    })
    if(policy){
        res.status(201).json()
    }else{
        res.status(400)
        throw new Error("Add Policy")
    }
})
const editPolicy = asyncHandler(async (req,res)=>{
    if (req.user.role !== 'agent') {
        res.status(403);
        throw new Error("Unauthorized: Only agents can edit policies.");
    }
    const id = req.params.id
    const policy =await Policy.findById(id)
    if(policy){
        const newPolicy = await Policy.findByIdAndUpdate(id,req.body,{new:true})
        res.status(200).json(newPolicy)
    }else{
        res.status(400)
        throw new Error("Policy doesnot exist")
    }
})

const deletePolicy = asyncHandler( async (req,res)=>{
    if (req.user.role !== 'agent') {
        res.status(403);
        throw new Error("Unauthorized: Only agents can delete policies.");
    }
    const id = req.params.id
    const policy = await Policy.findById(id)
    if(policy){
        await policy.deleteOne()
        res.status(200).json("Policy successfully deleted")
    }else{
        res.status(400)
        throw new Error("Policy doesnot exist")
    }
})



module.exports= {getAllPolicies,getPolicy,addPolicy,editPolicy,deletePolicy}