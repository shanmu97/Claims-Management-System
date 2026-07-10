const asyncHandler = require('express-async-handler')
const Policy = require('../Model/policyModel')
const logger = require('../logger')

const getAllPolicies=asyncHandler(async (req,res)=>{
    logger.info("Retrieve all policies request");
    const policies = await Policy.find()
    logger.info(`Successfully retrieved ${policies.length} policies`);
    res.status(200).json({policies: policies})
})

const getPolicy=asyncHandler(async (req,res)=>{
    const id = req.params.id 
    logger.info(`Retrieve policy request for ID: ${id}`);
    const policy = await Policy.findById(id)
    if(policy){
        logger.info(`Policy found for ID: ${id}`);
        res.status(200).json(policy)
    }else{
        logger.warn(`Policy not found for ID: ${id}`);
        res.status(404)
        throw new Error("Policy not exist")
    }
})

const addPolicy = asyncHandler(async(req,res)=>{
    logger.info(`Add policy request by user ID: ${req.user.id}, role: ${req.user.role}`);
    if (req.user.role !== 'agent') {
        logger.warn(`Unauthorized policy add attempt by user ID: ${req.user.id}, role: ${req.user.role}`);
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
        logger.warn(`Add policy failed: Policy already exists with identical fields`);
        res.status(400)
        throw new Error("Policy already exists.")
        return
    }
    if(amount<=0){
        logger.warn(`Add policy failed: Invalid amount: ${amount}`);
        res.status(400)
        throw new Error("Enter correct amount")
    }
    if(!name || !type || isNaN(amount) || !premium || !description){
        logger.warn("Add policy failed: Missing required fields");
        res.status(400)
        throw new Error("Enter all fields")
    }
    const policy  = await Policy.create({
        name,type,amount,premium,description
    })
    if(policy){
        logger.info(`Policy successfully added (ID: ${policy._id}, Name: ${name})`);
        res.status(201).json()
    }else{
        logger.error(`Failed to create policy in database for name: ${name}`);
        res.status(400)
        throw new Error("Add Policy")
    }
})
const editPolicy = asyncHandler(async (req,res)=>{
    const id = req.params.id
    logger.info(`Edit policy request for ID: ${id} by user ID: ${req.user.id}, role: ${req.user.role}`);
    if (req.user.role !== 'agent') {
        logger.warn(`Unauthorized policy edit attempt by user ID: ${req.user.id}, role: ${req.user.role}`);
        res.status(403);
        throw new Error("Unauthorized: Only agents can edit policies.");
    }
    const policy =await Policy.findById(id)
    if(policy){
        const newPolicy = await Policy.findByIdAndUpdate(id,req.body,{new:true})
        logger.info(`Policy successfully updated (ID: ${id})`);
        res.status(200).json(newPolicy)
    }else{
        logger.warn(`Edit policy failed: Policy does not exist (ID: ${id})`);
        res.status(400)
        throw new Error("Policy doesnot exist")
    }
})

const deletePolicy = asyncHandler( async (req,res)=>{
    const id = req.params.id
    logger.info(`Delete policy request for ID: ${id} by user ID: ${req.user.id}, role: ${req.user.role}`);
    if (req.user.role !== 'agent') {
        logger.warn(`Unauthorized policy delete attempt by user ID: ${req.user.id}, role: ${req.user.role}`);
        res.status(403);
        throw new Error("Unauthorized: Only agents can delete policies.");
    }
    const policy = await Policy.findById(id)
    if(policy){
        await policy.deleteOne()
        logger.info(`Policy successfully deleted (ID: ${id})`);
        res.status(200).json("Policy successfully deleted")
    }else{
        logger.warn(`Delete policy failed: Policy does not exist (ID: ${id})`);
        res.status(400)
        throw new Error("Policy doesnot exist")
    }
})

module.exports= {getAllPolicies,getPolicy,addPolicy,editPolicy,deletePolicy}