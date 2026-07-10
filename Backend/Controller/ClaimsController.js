const asyncHandler = require('express-async-handler')
const Policy = require('../Model/policyHolderModel')
const PolicyHolder = require('../Model/policyHolderModel')
const Claims = require('../Model/claimModel')
const logger = require('../logger')

const applyClaim = asyncHandler(async (req, res) => {
    const { status, claimAmount, appliedDate, reasonForClaim, policyId } = req.body;
    logger.info(`Apply claim request received. policyId: ${policyId}, amount: ${claimAmount}`);

    if (!status || !claimAmount || !appliedDate || !reasonForClaim || !policyId) {
        logger.warn("Apply claim failed: Missing required fields");
        res.status(400);
        throw new Error("Enter all fields");
    }

    const id = req.user._id;
    logger.info(`Fetching policyholder info for user ID: ${id}`);

    const policyHolder = await PolicyHolder.findOne({policyHolderId:id});
    if (!policyHolder) {
        logger.warn(`Apply claim failed: PolicyHolder not found for user ID: ${id}`);
        res.status(400);
        throw new Error("You have not policyHolder");
    }

    const activePolicies = policyHolder.policies
    if (activePolicies.length === 0) {
        logger.warn(`Apply claim failed: No active policies for policyholder: ${policyHolder._id}`);
        res.status(400);
        throw new Error("You have no active policies");
    }

    const policy = policyHolder.policies.find((p) => p._id.toString() === policyId);
    if (!policy) {
        logger.warn(`Apply claim failed: Policy ID ${policyId} not found in policyholder's active policies`);
        res.status(400);
        throw new Error("Policy does not exist");
    }

    if (claimAmount > policy.amount) {
        logger.warn(`Apply claim failed: Claim amount (${claimAmount}) exceeds policy amount (${policy.amount})`);
        res.status(400);
        throw new Error("Enter amount correctly");
    }

    const claim = await Claims.create({
        policyId: policy._id,
        policyholderId: policyHolder._id,
        status,
        claimAmount,
        appliedDate,
        reasonForClaim,
    });

    logger.info(`Claim document created successfully (ID: ${claim._id})`);

    // Append the claim to the policyholder's claims array
    policyHolder.claims.push(claim._id);
    await policyHolder.save();
    logger.info(`Claim ID ${claim._id} linked to policyholder ID ${policyHolder._id}`);

    res.status(200).json({ claim });
});

const updateClaim = asyncHandler(async (req, res) => {
    const id = req.params.id;
    logger.info(`Update claim request received for claim ID: ${id}`);
    const claim = await Claims.findById(id);

    if (!claim) {
        logger.warn(`Update claim failed: Claim not found (ID: ${id})`);
        res.status(400);
        throw new Error("Claim not found");
    }

    const updatedClaim = await Claims.findByIdAndUpdate(id, req.body, { new: true });
    logger.info(`Claim updated successfully (ID: ${id})`);
    res.status(200).json(updatedClaim);
});

const getAllClaims = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;
    logger.info(`Get all claims request from user ID: ${userId}, role: ${role}`);

    // Map the user ID to find the policyholder profile
    const policyHolder = await PolicyHolder.findOne({ policyHolderId: userId });
    
    if (!policyHolder) {
        logger.info(`No policyholder profile found for user ID: ${userId}. Returning empty claims list.`);
        return res.status(200).json([]);
    }

    // Retrieve only claims belonging to this policyholder
    const claims = await Claims.find({ policyholderId: policyHolder._id });
    logger.info(`Found ${claims.length} claims for user ID: ${userId} (PolicyHolder: ${policyHolder._id})`);
    return res.status(200).json(claims);
});

module.exports = {applyClaim,updateClaim,getAllClaims}