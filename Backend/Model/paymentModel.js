const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
  {
    policyHolderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PolicyHolder",
      required: [true, "Policyholder ID is required"],
    },
    policyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Policy",
      required: [true, "Policy ID is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Paid", "Failed"],
      default: "Paid",
    },
    stripePaymentIntentId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
