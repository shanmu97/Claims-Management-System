const asyncHandler = require('express-async-handler')
const Policy = require('../Model/policyHolderModel')
const PolicyHolder = require('../Model/policyHolderModel')
const Claims = require('../Model/claimModel')

const applyClaim = asyncHandler(async (req, res) => {
    const { status, claimAmount, appliedDate, reasonForClaim, policyId } = req.body;
    if (!status || !claimAmount || !appliedDate || !reasonForClaim || !policyId) {
        res.status(400);
        throw new Error("Enter all fields");
    }

    const id = req.user._id;
    console.log("User ID:", id); // Log the ID to check if it's correct

    const policyHolder = await PolicyHolder.findOne({policyHolderId:id});
    if (!policyHolder) {
        res.status(400);
        throw new Error("You have not policyHolder");
    }

    const activePolicies = policyHolder.policies
    if (activePolicies.length === 0) {
        res.status(400);
        throw new Error("You have no active policies");
    }

    const policy = policyHolder.policies.find((p) => p._id.toString() === policyId); // Use `policyId` from the request body
    if (!policy) {
        res.status(400);
        throw new Error("Policy does not exist");
    }

    if (claimAmount > policy.amount) {
        res.status(400);
        throw new Error("Enter amount correctly");
    }

    const claim = await Claims.create({
        policyId: policy._id,
        policyholderId: policyHolder._id,  // Make sure the policyholderId is correctly passed
        status,
        claimAmount,
        appliedDate,
        reasonForClaim,
    });

    // Append the claim to the policyholder's claims array
    policyHolder.claims.push(claim._id);
    await policyHolder.save();

    res.status(200).json({ claim });
});




const updateClaim = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const claim = await Claims.findById(id);

    if (!claim) {
        res.status(400);
        throw new Error("Claim not found");
    }

    const updatedClaim = await Claims.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedClaim);
});

const getAllClaims = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    if (req.user.role === 'policyholder') {
        const policyHolder = await PolicyHolder.findOne({policyHolderId:userId});
        const claims = await Claims.find({ policyholderId: policyHolder._id});  // Use `find` instead of `findOne`
        if (!claims || claims.length === 0) {
            res.status(404);
            throw new Error("No claims found for this policyholder.");
        }
        return res.status(200).json(claims);
    } else if (req.user.role === 'admin' || req.user.role === 'agent') {
        const claims = await Claims.find();
        if (!claims || claims.length === 0) {
            res.status(404);
            throw new Error("No claims found.");
        }
        return res.status(200).json(claims);
    }
    res.status(403);
    throw new Error("Unauthorized: Only policyholders, admins, or agents can view claims.");
});


module.exports = {applyClaim,updateClaim,getAllClaims}