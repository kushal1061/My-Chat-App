const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    type : { required: true, type: String, enum: ['single', 'group'], default: 'single' },
    participants : { required: true, type: [String] }, 
    groupName : { type: String, default: '' },
    groupBio:{ type: String, default: '' },
    groupPic : { type: String, default: '' },
    lastmessage : { type: Schema.Types.ObjectId, ref: 'Message' , time: Date },
    createdAt : { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);