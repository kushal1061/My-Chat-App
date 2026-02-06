const jwt =require('jsonwebtoken')
require("dotenv").config();
const User = require("../model/user");
module.exports = async (req, res, next) => {
  try {
    const token = req.body.token || req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "abc");
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: "Invalid token" });
    req.body.user = user;
    console.log("Authenticated user:", user);
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};