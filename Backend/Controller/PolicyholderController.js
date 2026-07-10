const asyncHandler = require('express-async-handler')
const PolicyHolder = require('../Model/policyHolderModel')
const Policy = require('../Model/policyModel')
const Claims = require('../Model/claimModel')
const logger = require('../logger')

const applyPolicy = asyncHandler(async (req, res) => {
    const { dob, address, PAN_NUMBER, policyId } = req.body;
    logger.info(`Apply policy request received for policyId: ${policyId} by user ID: ${req.user._id}`);

    if (!dob || !address || !PAN_NUMBER || !policyId) {
        logger.warn("Apply policy failed: Missing required fields");
        res.status(400);
        throw new Error("Enter all fields");
    }
    const policy = await Policy.findById(policyId);
    if (!policy) {
        logger.warn(`Apply policy failed: Policy ID ${policyId} does not exist`);
        res.status(400);
        throw new Error("Policy does not exist");
    }
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    if (age < 18) {
        logger.warn(`Apply policy failed: User age (${age}) is under 18`);
        res.status(400);
        throw new Error("Age should be at least 18.");
    }
    if (PAN_NUMBER.length !== 10) {
        logger.warn(`Apply policy failed: Invalid PAN number length: ${PAN_NUMBER}`);
        res.status(400);
        throw new Error("Enter a valid PAN number");
    }
    if (req.user.role !== 'policyholder') {
        logger.warn(`Apply policy failed: Unauthorized user role: ${req.user.role} for user ID: ${req.user._id}`);
        res.status(400);
        throw new Error("Only policyholders can claim the policies");
    }
    if (!req.user.name || !req.user.email || !req.user.phone) {
        logger.warn(`Apply policy failed: Incomplete user data for user ID: ${req.user._id}`);
        res.status(400);
        throw new Error("User data is incomplete.");
    }
    
    let policyHolder = await PolicyHolder.findOne({ policyHolderId: req.user._id });
    if (!policyHolder) {
        logger.info(`Creating new PolicyHolder profile for user ID: ${req.user._id}`);
        policyHolder = await PolicyHolder.create({
            policyHolderId: req.user._id,
            name: req.user.name,
            email: req.user.email,
            phone: req.user.phone,
            dob,
            address,
            PAN_NUMBER,
            amount: policy.amount,
            policies: [policyId],
            claims: [],
        });
        logger.info(`PolicyHolder profile created successfully (ID: ${policyHolder._id})`);
    } else {
        logger.info(`Existing PolicyHolder profile found (ID: ${policyHolder._id}). Checking policy subscription.`);
        if (!policyHolder.policies.includes(policyId)) {
            policyHolder.policies.push(policyId);
            await policyHolder.save();
            logger.info(`Policy ID ${policyId} successfully added to policyholder ${policyHolder._id}`);
        } else {
            logger.warn(`Apply policy failed: Policy ID ${policyId} already claimed by policyholder ${policyHolder._id}`);
            res.status(400);
            throw new Error("You have already claimed the policy.");
        }
    }
    res.status(201).json(policyHolder);
});

const updatePolicy = asyncHandler(async (req,res)=>{
    logger.info(`Update policyholder request by user ID: ${req.user.id}, role: ${req.user.role}`);
    if(req.user.role==='policyholder'){
        logger.warn(`Update policyholder failed: Policyholder user ID ${req.user.id} tried to update data`);
        res.status(400)
        throw new Error("You cannot update the data")
    }
    const id = req.params.id 
    
    const policyHolder = await PolicyHolder.findById(id)
    if(!policyHolder){
        logger.warn(`Update policyholder failed: Profile not found for ID: ${id}`);
        res.status(400)
        throw new Error("User has not claimed any policy")
    }else{
        const newPolicyHolder = await PolicyHolder.findByIdAndUpdate(id,req.body,{new:true})
        logger.info(`Policyholder profile updated successfully for ID: ${id}`);
        res.status(200).json(newPolicyHolder)
    }
})

const getAllPolicyHolders = asyncHandler(async (req, res) => {
    logger.info("Retrieve all policyholders request");
    const policyHolders = await PolicyHolder.find();
    if (!policyHolders || policyHolders.length === 0) {
        logger.info("No policyholders found in the system");
        res.status(404);
        throw new Error("No policyholders found.");
    }
    logger.info(`Successfully retrieved ${policyHolders.length} policyholders`);
    res.status(200).json(policyHolders);
});

const getAllPolicies = asyncHandler(async (req, res) => {
    logger.info(`Retrieve all subscribed policies for policyholder user ID: ${req.user._id}`);
    const policyHolder = await PolicyHolder.findOne({ policyHolderId: req.user._id });
    
    if (!policyHolder) {
        logger.info(`No policyholder profile found for user ID: ${req.user._id}. Returning empty policies list.`);
        return res.status(200).json([]);
    }

    const policies = await Policy.find({ _id: { $in: policyHolder.policies } });
    if (!policies || policies.length === 0) {
        logger.info(`No policies found for policyholder: ${policyHolder._id}. Returning empty policies list.`);
        return res.status(200).json([]);
    }

    logger.info(`Retrieved ${policies.length} subscribed policies for policyholder: ${policyHolder._id}`);
    res.status(200).json(policies);
});

module.exports = {applyPolicy,updatePolicy,getAllPolicyHolders,getAllPolicies}
