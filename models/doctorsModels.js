const mongoose = require('mongoose')
const schema = mongoose.Schema;

const doctorSchema = new schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
            unique: true, 
        },
        firstName: {
            type:String,
            required: [true, 'firstname is Required!']
        },
        lastName: {
            type:String,
            required: [true, 'lastname is Required!']
        },
        phone: {
            type:String,
            required: [true, 'Contact Number is Required!']
        },
        email: {
            type:String,
            required: [true, 'Email is Required!']
        },
        address: {
            type:String,
            required: [true, 'Address is Required!']
        },
        website: {
            type:String,
        },
        specialization: {
            type:String,
            required: [true, 'Specialization is Required!']
        },
        experience: {
            type:String,
            required: [true, 'Fxperience is Required!']
        },
        feesPerConsultation: {
            type:String,
            required: [true, 'Fee is Required!']
        },
        status:{
            type:String,
            default: "pending"
        },
        timings: {
            type:Object,
            required: [true, 'Work is Required!']
        },
    },
    {timestamps:true}
);

module.exports = mongoose.model('Doctor', doctorSchema);