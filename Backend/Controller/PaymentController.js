const asyncHandler = require("express-async-handler");
const Payment = require("../Model/paymentModel");
const PolicyHolder = require("../Model/policyHolderModel");
const Policy = require("../Model/policyModel");
const logger = require("../logger");
const { sendEmailNotification } = require("../emailService");

// Mock creating a payment intent for Stripe
const createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount, policyId } = req.body;
  logger.info(`Stripe payment intent requested for amount: ${amount}, policyId: ${policyId}`);

  if (!amount || !policyId) {
    res.status(400);
    throw new Error("Missing amount or policyId");
  }

  // Create a mock Stripe client secret
  const clientSecret = `pi_${Math.random().toString(36).substring(2, 15)}_secret_${Math.random().toString(36).substring(2, 15)}`;
  res.status(200).json({ clientSecret });
});

// Confirm/Record Payment after successful mock Stripe checkout
const recordPayment = asyncHandler(async (req, res) => {
  const { policyId, amount, clientSecret } = req.body;
  const userId = req.user.id;

  logger.info(`Recording payment for policyId: ${policyId}, amount: ${amount}`);

  if (!policyId || !amount || !clientSecret) {
    res.status(400);
    throw new Error("Missing policyId, amount, or clientSecret");
  }

  const policyHolder = await PolicyHolder.findOne({ policyHolderId: userId }).populate("policyHolderId");
  if (!policyHolder) {
    res.status(400);
    throw new Error("Policyholder profile not found");
  }

  const policy = await Policy.findById(policyId);
  if (!policy) {
    res.status(400);
    throw new Error("Policy not found");
  }

  // Create payment record
  const payment = await Payment.create({
    policyHolderId: policyHolder._id,
    policyId: policy._id,
    amount,
    stripePaymentIntentId: clientSecret,
    status: "Paid",
  });

  logger.info(`Payment recorded successfully with ID: ${payment._id}`);

  // Send premium payment receipt email
  const emailHtml = `
    <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px;">
      <h2 style="color: #2ecb71; border-bottom: 2px solid #2ecb71; padding-bottom: 10px;">Payment Receipt - Premium Paid</h2>
      <p>Dear ${policyHolder.policyHolderId.name},</p>
      <p>Thank you for your payment. We have successfully processed your premium payment for <strong>${policy.name}</strong>.</p>
      <table style="border-collapse: collapse; width: 100%; margin-top: 15px;">
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9; width: 150px;">Policy Name</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${policy.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Amount Paid</td>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #2ecb71;">₹ ${amount}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Transaction ID</td>
          <td style="padding: 10px; border: 1px solid #ddd; font-family: monospace; font-size: 13px;">${clientSecret}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; background-color: #f9f9f9;">Date</td>
          <td style="padding: 10px; border: 1px solid #ddd;">${new Date().toLocaleDateString()}</td>
        </tr>
      </table>
      <p style="margin-top: 20px;">Your coverage remains active and in good standing. You can review your transaction history anytime in your profile dashboard.</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
      <p style="font-size: 12px; color: #777; text-align: center;">This is an automated payment confirmation email. Please do not reply directly.</p>
    </div>
  `;
  await sendEmailNotification({
    to: policyHolder.policyHolderId.email,
    subject: `Payment Receipt: Premium Paid for ${policy.name}`,
    htmlText: emailHtml,
  });

  res.status(201).json(payment);
});

// Fetch all payment history for the authenticated user
const getPaymentHistory = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  logger.info(`Fetching payment history for user ID: ${userId}`);

  const policyHolder = await PolicyHolder.findOne({ policyHolderId: userId });
  if (!policyHolder) {
    return res.status(200).json([]);
  }

  const payments = await Payment.find({ policyHolderId: policyHolder._id })
    .populate("policyId")
    .sort({ createdAt: -1 });

  res.status(200).json(payments);
});

module.exports = { createPaymentIntent, recordPayment, getPaymentHistory };
