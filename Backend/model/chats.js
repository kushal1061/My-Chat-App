const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chatSchema = new Schema({
    type: { required: true, type: String, enum: ['single', 'group'], default: 'single' },
    participants: { required: true, type: [{ type: Schema.Types.ObjectId, ref: 'User' }] },
    groupName: { type: String, default: '' },
    groupBio: { type: String, default: '' },
    groupPic: { type: String, default: '' },
    lastMessage: {
    text: { type: String, default: '' },
    time: { type: Date, default: Date.now }
},
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Chat', chatSchema);