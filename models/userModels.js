const mongoose = require('mongoose')
const schema = mongoose.Schema;

const userSchema = new schema({
    user: {
        type: String,
        required: [true,'Name is required']
    },
    email:{
        type: String,
        required: [true, 'Email is required']
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Admin: Number
    },
    password:{
        type: String,
        required: [true, 'Password is required'],
        select: false,
    },
    notification: {
        type: Array,
        default: [],
    },
    seenNotification: {
        type: Array,
        default: [],
    },
    refreshToken: {
        type:String,
        select: false,
    }
})

module.exports = mongoose.model('User', userSchema);