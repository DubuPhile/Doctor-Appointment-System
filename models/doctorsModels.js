const mongoose = require('mongoose')
const schema = mongoose.Schema;

const doctorSchema = new schema(
    {
        userId: {
            type:String
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
        feesPerCunsaltation: {
            type:Number,
            required: [true, 'Fee is Required!']
        },
        timings: {
            type:Object,
            required: [true, 'Work is Required!']
        },
        refreshToken: String
    },
    {timestamps:true}
);

module.exports = mongoose.model('Doctor', doctorSchema);