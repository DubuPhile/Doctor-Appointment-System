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
        required: [true, 'Password is required']
    },
    refreshToken: String
})

module.exports = mongoose.model('users', userSchema);