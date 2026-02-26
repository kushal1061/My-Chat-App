const User = require("../model/user")
const Message = require('../model/messages')
const Chat = require("../model/chats");
const messages = require("../model/messages");
exports.getChat = async (req, res) => {
    const user = req.body.user;
    const chatId = req.body.chatId;
    const messages = await Message.find({ chatId: chatId }).sort({ timestamp: -1 }).limit(100);
    res.json(messages);
}
exports.getChats = async (req, res) => {
    const user = req.body.user;
    const userId = user._id;
    const chats = await Chat
        .find({ participants: userId })
        .sort({ updatedAt: -1 })
        .lean();  ///----IMPORTANT-----------
    const updatedChats = await Promise.all(
        chats.map(async (chat) => {
            if (chat.type === 'single') {
                const receiverId = chat.participants.find(p => p.toString() !== userId.toString());
                const receiver = await User.findById(
                    receiverId,
                    { name: 1, profilePic: 1, status: 1 }
                );
                chat.name = receiver?.name || "Unknown";
                chat.profilePic = receiver?.profilePic || "";
                chat.status = receiver?.status || "offline";
            }
            return chat;
        })
    );
    res.json(chats);
}
exports.createChat = async (req, res) => {
    const participants = req.body.participants;
    const newChat = new Chat({
        participants: participants
    });
    const savedChat = await newChat.save();
    res.json({
        chat: newChat,
        messages: []
    });
}
exports.updateGroup = async (req, res) => {
    const chatId = req.body.chatId;
    const groupName = req.body.groupName;
    const groupPic = req.body.groupPic;
    const updatedChat = Chat.findOneAndUpdate({ _id: chatId }, { groupName: groupName, groupPic: groupPic });
    res.json(updatedChat);
}