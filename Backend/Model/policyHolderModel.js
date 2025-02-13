const mongoose = require("mongoose");

const policyHolderSchema = mongoose.Schema(
  {
    policyHolderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    dob: {
      type: Date,
      required: [true, "Date of Birth Required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    PAN_NUMBER: {
      type: String,
      required: [true, "Pan Card is required"],
    },
    policies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Policy",
      },
    ],
    claims: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Claims",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PolicyHolder", policyHolderSchema);
