const mongoose = require('mongoose')
const schema = mongoose.Schema;

const appointmentSchema = new schema({
    userId: {
        type: String,
        required: true,
    },
    doctorId: {
        type: String,
        required: true,
    },
    doctorInfo: {
        type: String,
        required: true,
    },
    userInfo: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: "pending"
    },
    time: {
        type: Date,
        required: true,
    },
},{timestamps:true})
module.exports = mongoose.model('Appointment', appointmentSchema);