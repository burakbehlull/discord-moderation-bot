const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    userID: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String || Number,
        required: true,
    },
    limit: {
        type: Boolean,
        required: true
    },
    hasRole: {
        type: Array
    },
	eId: {
		type: String
	}

})

const User = mongoose.model('User', userSchema)
module.exports = User