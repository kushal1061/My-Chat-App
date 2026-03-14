const jwt =require('jsonwebtoken')
require("dotenv").config();
const User = require("../model/user");
module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "abc");
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: "Invalid token" });

    req.user = user;
    req.body = req.body || {};
    req.body.user = user;

    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
