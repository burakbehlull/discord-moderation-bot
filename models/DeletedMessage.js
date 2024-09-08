const mongoose = require('mongoose')
const Schema = mongoose.Schema

const deletedMessageSchema = new Schema({
    messageContent: {
        type: String,
        required: true
    },
    authorTag: {
        type: String,
        required: true
    },
    channelId: {
        type: String,
        required: true
    },
    guildId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const DeletedMessage = mongoose.model('DeletedMessage', deletedMessageSchema)
module.exports = DeletedMessage
