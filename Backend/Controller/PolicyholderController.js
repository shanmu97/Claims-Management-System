const asyncHandler = require('express-async-handler')
const PolicyHolder = require('../Model/policyHolderModel')
const Policy = require('../Model/policyModel')
const Claims = require('../Model/claimModel')

const applyPolicy = asyncHandler(async (req, res) => {
    const { dob, address, PAN_NUMBER, policyId } = req.body;
    if (!dob || !address || !PAN_NUMBER || !policyId) {
        res.status(400);
        throw new Error("Enter all fields");
    }
    const policy = await Policy.findById(policyId);
    if (!policy) {
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
        res.status(400);
        throw new Error("Age should be at least 18.");
    }
    if (PAN_NUMBER.length !== 10) {
        res.status(400);
        throw new Error("Enter a valid PAN number");
    }
    if (req.user.role !== 'policyholder') {
        res.status(400);
        throw new Error("Only policyholders can claim the policies");
    }
    if (!req.user.name || !req.user.email || !req.user.phone) {
        res.status(400);
        throw new Error("User data is incomplete.");
    }
    let policyHolder = await PolicyHolder.findOne({ policyHolderId: req.user._id });
    if (!policyHolder) {
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
    } else {
        if (!policyHolder.policies.includes(policyId)) {
            policyHolder.policies.push(policyId);
            await policyHolder.save();
        } else {
            res.status(400);
            throw new Error("You have already claimed the policy.");
        }
    }
    res.status(201).json(policyHolder);
});



const updatePolicy=asyncHandler(async (req,res)=>{
    if(req.user.role==='policyholder'){
        res.status(400)
        throw new Error("You cannot update the data")
    }
    const id = req.params.id 
    
    const policyHolder = await PolicyHolder.findById(id)
    if(!policyHolder){
        res.status(400)
        throw new Error("User has not claimed any policy")
    }else{
        const newPolicyHolder = await PolicyHolder.findByIdAndUpdate(id,req.body,{new:true})
        res.status(200).json(newPolicyHolder)
    }
})

const getAllPolicyHolders = asyncHandler(async (req, res) => {
    const policyHolders = await PolicyHolder.find();
    if (!policyHolders || policyHolders.length === 0) {
        res.status(404);
        throw new Error("No policyholders found.");
    }
    res.status(200).json(policyHolders);
});


const getAllPolicies = asyncHandler(async (req, res) => {
    const policyHolder = await PolicyHolder.findOne({ policyHolderId: req.user._id });
    if (!policyHolder) {
        res.status(404);
        throw new Error("Policyholder not found.");
    }
    const policies = await Policy.find({ _id: { $in: policyHolder.policies } });
    if (!policies) {
        res.status(404);
        throw new Error("No policies found for this user.");
    }
    if(policies.length===0){
        res.status(200).json("No policies are found")
    }
    res.status(200).json(policies);
});

module.exports = {applyPolicy,updatePolicy,getAllPolicyHolders,getAllPolicies}
