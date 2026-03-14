const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("../model/user");
const { upload } = require("./upload.contoller");
exports.registerUser = async (req, res) => {
    const { name, password, email, phone } = req.body;

    if (!name || !password || !email || !phone) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({
            $or: [{ name }, { email }, { phone }]
        });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            password: hashedPassword,
            email,
            phone,
            createdAt: Date.now()
        });
        await newUser.save();
        console.log(`Registering user: ${name}`);
        return res.status(200).json({ message: "User registered successfully" });
    }
    catch (e) {
        console.error(`Error registering user: ${e.message}`);
        return res.status(500).json({ message: "Error registering user" });
    }
};
exports.loginUser = async (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) {
        return res.status(400).json({ message: "Name and password are required" });
    }

    try {
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        console.log(`User logged in: ${name}`);
        const userId = user._id;
        const token = jwt.sign(
            { userId },
            process.env.JWT_SECRET || "abc",
            { expiresIn: "7d" }
        );
        return res.status(200).json({
            token,
            phone: user.phone,
            userId: user._id,
            message: "Logged in successfully"
        });
    } catch (e) {
        console.error(`Error logging in user: ${e.message}`);
        return res.status(500).json({ message: "Error logging in user" });
    }
}
exports.searchUsers = async (req, res) => {
    const query = req.body.query;
    // console.log(user)
    const myId = req.body.user._id;
    const ph = req.body.query
    let users = [];
    try {

        users = await User.aggregate([
            // 1️⃣ Remove self
            {
                $match: {
                    _id: { $ne: new mongoose.Types.ObjectId(myId) },
                    $or: [
                        { name: { $regex: ph, $options: "i" } },
                        { phone: { $regex: `^${ph}` } }
                    ]
                }
            },
            // 2️⃣ Find existing chats with this user
            {
                $lookup: {
                    from: "chats",
                    let: { otherUserId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $in: [
                                                new mongoose.Types.ObjectId(myId),
                                                { $ifNull: ["$participants", []] }
                                            ]
                                        },
                                        {
                                            $in: [
                                                "$$otherUserId",
                                                { $ifNull: ["$participants", []] }
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "chat"
                }
            }
            ,

            // 3️⃣ Add flag
            {
                $addFields: {
                    hasChat: { $gt: [{ $size: "$chat" }, 0] },
                    chatId: { $arrayElemAt: ["$chat._id", 0] }
                }
            },

            // 4️⃣ Sort: existing chats first
            {
                $sort: { hasChat: -1, name: 1 }
            },

            // 5️⃣ Cleanup
            {
                $project: {
                    chat: 0
                }
            }
        ]);
    }
    catch (e) {
        console.error(`Error searching users: ${e.message}`);
    }

    console.log(query);
    console.log(users);
    res.json(users);
}
exports.updateProfilePic = async (req, res) => {
    const user = req.body.user;
    const newProfilePic = req.body.profilePic;
     const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: { profilePic: newProfilePic } },
      { new: true }
    );
    if (updatedUser) res.json(
        {
            message: "profilePic updated successfully",
            url: newProfilePic
        }
    )
}
exports.me = async (req, res) => {
    const user = req.user;
    res.json(user);
}
exports.update = async (req, res) => {
    req.user.name = req.body.name || req.user.name;
    req.user.phone = req.body.phone || req.user.phone;
    req.user.email = req.body.email || req.user.email;
    req.user.save();
    res.json(req.user);
}