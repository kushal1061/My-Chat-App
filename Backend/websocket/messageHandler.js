const websocketClients=require('./clients')
const Chat=require('../model/chats')
const Message=require('../model/messages')
const User=require('../model/user')
const jwt = require("jsonwebtoken")
const webSocket = require('ws');
async function sendPendingmsg(phone) {
    const userChats = await Chat.find({
        participants: phone
    }).select("_id");
    const chatIds = userChats.map(c => c._id);
    const undeiliveredMessages = await Message.find({
        chatId: { $in: chatIds },
        deliveredto: { $ne: phone },
        sender: { $ne: phone }
    });
    for (const msg of undeiliveredMessages) {
        if (websocketClients[phone]) {
            websocketClients[phone].send(JSON.stringify({
                type: "message",
                data: msg
            }));
            const updateMsg = await Message.findOneAndUpdate(
                { _id: msg._id },
                {
                    $addToSet: { deliveredto: phone },
                    $set: { [`delivered_at.${phone}`]: new Date() }
                }
            )
            if (updateMsg) {
                console.log("Pending message delivered to", phone);
            }

        }
    }
}
async function handleChat(ws, payload) {
    if (payload.type === 'chat') {
        // save
        let chatId = payload.chatId;
        let receivers = [];
        try {
            if (chatId) {

                receivers = await Chat.findOne({ _id: chatId });
                receivers = receivers.participants.filter(p => p != payload.sender);
            }
        }
        catch (e) {
            console.log("Error finding chat:", e);
        }
        if (!chatId) {
            console.log(payload.sender);
            const participants = [payload.sender, payload.receiver];
            chatId = await createChat(participants)
            console.log("New chat created with ID:", chatId);
            receivers = [payload.receiver];
        }
        const newMsg = new Message({
            sender: payload.sender,
            chatId,
            text: payload.text,
        })
        const chatUpdate = await Chat.findOneAndUpdate(
            { _id: chatId },
            { lastmessage: newMsg._id }
        );
        console.log(newMsg);
        newMsg.save().then(() => console.log("saved")).catch(e => consol.log(e));
        for (const receiver of receivers) {
            if (websocketClients[receiver]) {
                console.log("iam akasdhj")
                websocketClients[receiver].send(JSON.stringify({
                    type: 'chat',
                    text: payload.text,
                    sender: payload.sender
                }));
                const updateMsg = await Message.findOneAndUpdate(
                    { _id: newMsg._id },
                    {
                        $addToSet: { deliveredto: receiver },
                        $set: { [`delivered_at.${receiver}`]: new Date() }
                    }
                )
            }
        }

    }
}
async function handleAuth(ws, payload) {
    const token = payload.token;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'abc');
        const user = await User.findOne({ _id: decoded.userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const phone = user.phone;
        websocketClients[phone] = ws;
        // console.log("User authenticated:", payload.phone);
        console.log(process.env.JWT_SECRET)
    }
    catch (e) {
        console.log(e);
    }
    // verify user
    sendPendingmsg(payload.phone);
}
module.exports = async (ws, payload) => {
    const type = payload.type;
    switch (type) {
        case 'auth':
            handleAuth(ws, payload);
        case 'chat':
            handleChat(ws, payload)
            break;
        case 'rtc':
            handleCall(ws, payload);
        default:
            break;
    }
}