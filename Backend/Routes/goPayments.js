const express = require("express");
const { protect } = require("../Middleware/authMiddleware");
const {
  createPaymentIntent,
  recordPayment,
  getPaymentHistory,
} = require("../Controller/PaymentController");

const router = express.Router();

router.post("/intent", protect, createPaymentIntent);
router.post("/record", protect, recordPayment);
router.get("/history", protect, getPaymentHistory);

module.exports = router;
