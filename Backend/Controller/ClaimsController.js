const asyncHandler = require('express-async-handler')
const Policy = require('../Model/policyModel')
const PolicyHolder = require('../Model/policyHolderModel')
const Claims = require('../Model/claimModel')
const logger = require('../logger')
const { sendEmailNotification } = require('../emailService')
const User = require('../Model/userModal')

const applyClaim = asyncHandler(async (req, res) => {
    const { status, claimAmount, appliedDate, reasonForClaim, policyId, attachmentUrl, attachmentName } = req.body;
    logger.info(`Apply claim request received. policyId: ${policyId}, amount: ${claimAmount}`);

    if (!claimAmount || !appliedDate || !reasonForClaim || !policyId) {
        logger.warn("Apply claim failed: Missing required fields");
        res.status(400);
        throw new Error("Enter all fields");
    }

    const id = req.user._id;
    logger.info(`Fetching policyholder info for user ID: ${id}`);

    const policyHolder = await PolicyHolder.findOne({policyHolderId:id}).populate('policies');
    if (!policyHolder) {
        logger.warn(`Apply claim failed: PolicyHolder not found for user ID: ${id}`);
        res.status(400);
        throw new Error("You have no policyholder profile");
    }

    const activePolicies = policyHolder.policies;
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
        throw new Error("Claim amount cannot exceed coverage amount");
    }

    const claim = await Claims.create({
        policyId: policy._id,
        policyholderId: policyHolder._id,
        status: status || "Applied",
        claimAmount,
        appliedDate,
        reasonForClaim,
        attachmentUrl,
        attachmentName,
    });

    logger.info(`Claim document created successfully (ID: ${claim._id})`);

    // Append the claim to the policyholder's claims array
    policyHolder.claims.push(claim._id);
    await policyHolder.save();
    logger.info(`Claim ID ${claim._id} linked to policyholder ID ${policyHolder._id}`);

    // Send email notification to user
    const emailHtml = `
      <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #2e6be4; border-bottom: 2px solid #2e6be4; padding-bottom: 10px;">Claim Submitted Successfully</h2>
        <p>Dear ${req.user.name},</p>
        <p>Your claim has been submitted and is currently under review by our agents.</p>
        <table style="border-collapse: collapse; width: 100%; margin-top: 15px;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9; width: 150px;">Policy Name</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${policy.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Claimed Amount</td>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #2e6be4;">₹ ${claimAmount}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Reason</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${reasonForClaim}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Status</td>
            <td style="padding: 10px; border: 1px solid #ddd; color: #ffa726; font-weight: bold;">${status || "Applied"}</td>
          </tr>
        </table>
        <p style="margin-top: 20px;">You can monitor the status of your claim in your profile dashboard at any time.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
        <p style="font-size: 12px; color: #777; text-align: center;">This is an automated notification from the Claims Management System. Please do not reply directly.</p>
      </div>
    `;
    await sendEmailNotification({
        to: req.user.email,
        subject: `Claim Submitted - ₹${claimAmount} for ${policy.name}`,
        htmlText: emailHtml,
    });

    res.status(200).json(claim);
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

    const oldStatus = claim.status;
    const updatedClaim = await Claims.findByIdAndUpdate(id, req.body, { new: true });
    logger.info(`Claim updated successfully (ID: ${id})`);

    // Fetch policyholder and user information to send status change email
    try {
        const ph = await PolicyHolder.findById(claim.policyholderId).populate('policyHolderId');
        const policy = await Policy.findById(claim.policyId);
        
        if (ph && ph.policyHolderId && policy) {
            const userEmail = ph.policyHolderId.email;
            const userName = ph.policyHolderId.name;
            const newStatus = req.body.status || oldStatus;

            // Only email if status is changing or approved amount is set
            if (oldStatus !== newStatus || req.body.approvedAmount !== undefined) {
                const statusColors = {
                    Applied: "#2e6be4",
                    Pending: "#ffa726",
                    Approved: "#2ecb71",
                    Rejected: "#e74c3c"
                };
                
                const emailHtml = `
                  <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px;">
                    <h2 style="color: #2e6be4; border-bottom: 2px solid #2e6be4; padding-bottom: 10px;">Claim Status Updated</h2>
                    <p>Dear ${userName},</p>
                    <p>The status of your claim for policy <strong>${policy.name}</strong> has been updated by our review team.</p>
                    <table style="border-collapse: collapse; width: 100%; margin-top: 15px;">
                      <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9; width: 150px;">Claimed Amount</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">₹ ${updatedClaim.claimAmount}</td>
                      </tr>
                      ${updatedClaim.approvedAmount !== undefined ? `
                      <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Approved Amount</td>
                        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #2ecb71;">₹ ${updatedClaim.approvedAmount}</td>
                      </tr>` : ''}
                      <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">New Status</td>
                        <td style="padding: 10px; border: 1px solid #ddd; color: ${statusColors[newStatus] || '#333'}; font-weight: bold;">${newStatus}</td>
                      </tr>
                    </table>
                    <p style="margin-top: 20px;">Please check your dashboard for further details and correspondence.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
                    <p style="font-size: 12px; color: #777; text-align: center;">This is an automated notification. Please do not reply directly.</p>
                  </div>
                `;
                await sendEmailNotification({
                    to: userEmail,
                    subject: `Claim Update: ${newStatus} - ${policy.name}`,
                    htmlText: emailHtml
                });
            }
        }
    } catch (err) {
        logger.error("Failed to send status update email: %o", err);
    }

    res.status(200).json(updatedClaim);
});

const getAllClaims = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;
    logger.info(`Get all claims request from user ID: ${userId}, role: ${role}`);

    // If admin or agent, fetch ALL claims in the system
    if (role === 'admin' || role === 'agent') {
        const claims = await Claims.find()
            .populate({
                path: 'policyholderId',
                populate: { path: 'policyHolderId', select: 'name email phone' }
            })
            .populate('policyId');
        logger.info(`Found ${claims.length} total claims for admin/agent`);
        return res.status(200).json(claims);
    }

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