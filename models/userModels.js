const mongoose = require('mongoose')
const schema = mongoose.Schema;

const userSchema = new schema({
    user: {
        type: String,
        required: [true,'Name is required']
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Admin: Number
    },
    isDoctor:{
        type: Boolean,
        default: false
    },
    password:{
        type: String,
        select: false,
    },
    loginAttempts: {
    type: Number,
    default: 0
    },
    lockUntil: {
        type: Date,
        default: null
    },
    authProviderId:{
        type: String,
        select: false,
    },
    authProvider:{
        type: String,
        enum: ['local', 'google','firebase'],
        default: 'local',
    },
    notification: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            type: { type: String, required: true },
            message: { type: String, required: true },
            data: { type: Object },
            seen: { type: Boolean, default: false },
            createdAt: { type: Date, default: Date.now },
            from: {type: String, default: "unknown"}
        }
    ],
    refreshToken: {
        type:String,
        select: false,
    }
},{timestamps: true })

module.exports = mongoose.model('User', userSchema);