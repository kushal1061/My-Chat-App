const jwt =require('jsonwebtoken')
require("dotenv").config();
const User = require("../model/user");
module.exports = async (req, res, next) => {
  // console.log("Authenticating user...");
  try {
    const authHeader = req.headers.authorization;
    console.log("Authorization header:", authHeader);
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    // console.log("Token received:", token);
    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });

    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "abc");
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: "Invalid token" });
    if(req.body){
      req.body.user = user;
    }else
    {
      req.user = user;
    }
    console.log("Authenticated user:", user);
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};