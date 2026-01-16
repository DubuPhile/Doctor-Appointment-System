const appointmentModel = require('../models/appointmentModel');
const doctorsModel = require('../models/doctorsModels');
const usersModel = require('../models/userModels');

//get doctor Info
const getDoctorInfoController = async( req, res ) => {
    const {userId} = req.body
    try{
        const doctor = await doctorsModel.findOne({userId})
        res.status(200).send({
            success: true,
            message: 'doctor data fetch success',
            data: doctor,
        });
    } catch(err){
        console.log(err)
        res.status(500).send({
            success: false,
            err,
            message: "Error Fetching Doctors Details"
        })
    }
}
//update doctor Profile
const updateProfileController = async( req, res ) => {
    const {userId} = req.body
    try{
        const doctor = await doctorsModel.findOneAndUpdate({ userId }, req.body)
        res.status(201).send({
            success:true,
            message: 'Doctor Profile Updated',
            data: doctor,
        })
    }catch(err){
        console.log(err)
        res.status(500).send({
            success: false,
            err,
            message: "Invalid Update"
        })
    }
}

const getDoctorIdController = async( req, res ) => {
    const {doctorId} = req.query
    try{
        const doctor = await doctorsModel.findOne({userId: doctorId});
        res.status(200).send({
            success: true,
            message: "Single fetch Doctor",
            data: doctor,
        });

    } catch(err){
        console.log(err)
        res.status(500).send({
            success: false,
            err,
            message: "Somethings Wrong getting Doctors ID"
        })
    }
}
const getDoctorAppointmentsController = async( req, res ) => {
    try{
        const doctor = await doctorsModel.findOne({userId: req.query.userId})
        const appointments = await appointmentModel.find({doctorId: doctor.userId}).populate('doctorInfo').populate('userInfo');
        res.status(200).send({
            success: true,
            message: "Doctor Appointment Fetch Successfully",
            data: appointments,
        })
    } catch(err){
        console.log(err)
        res.status(500).send({
            success: false,
            err,
            message: "Doctor Appointments Fetch Error"
        })
    }
}

const updateStatusController = async( req, res ) => {
    try{
        const {appointmentsId, status} = req.body

        const appointments = await appointmentModel.findByIdAndUpdate(appointmentsId, {status})
        const user = await usersModel.findOne({_id: appointments.userId})
        user.notification.push({
            from: `${req.user.user}`,
            type: "New-appointment-request",
            message: `Your appointment has been updated ${status}`,
        });
        await user.save();
        res.status(200).send({
            success: true,
            message: "Appointment Status Updated"
        })
    } catch(err){
        console.log(err)
        res.status(500).send({
            success: false,
            err,
            message: "Error Updating the Status"
        })
    }
}
module.exports = { 
    getDoctorInfoController, 
    updateProfileController, 
    getDoctorIdController,
    getDoctorAppointmentsController,
    updateStatusController,
}