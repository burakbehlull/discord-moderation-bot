const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roomSchema = new Schema({
    id: {
        type: String,
    },
    ownerId: {
        type: String
    }
})

const Room = mongoose.model('Room', roomSchema)
module.exports = Room