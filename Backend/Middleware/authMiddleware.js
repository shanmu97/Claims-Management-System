const jwt = require("jsonwebtoken");
const User = require("../Model/userModal");
const asyncHandler = require("express-async-handler");
const logger = require("../logger");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        logger.warn(`Auth failed: User not found for decoded ID ${decoded.id}`);
        res.status(401);
        throw new Error("Not authorised");
      }
      logger.info(`Auth successful for user: ${req.user.email} (ID: ${req.user.id})`);
      next();
    } catch (error) {
      logger.warn(`Auth failed: Invalid or expired token on ${req.method} ${req.url}. Error: ${error.message}`);
      res.status(401)
      throw new Error("Not authorised");
    }
  
  }
  if (!token) {
    logger.warn(`Auth failed: No token provided on ${req.method} ${req.url}`);
    res.status(401)
    throw new Error("Not Authorised");
  }
});

module.exports = { protect };
