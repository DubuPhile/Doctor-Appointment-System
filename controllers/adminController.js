const doctorsModel = require ('../models/doctorsModels')
const usersModel = require ('../models/userModels')
const appointmentModel = require('../models/appointmentModel');

const getAllUsersController = async( req , res ) => {

    try{
        if (!req.roles?.includes(5150)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const users = await usersModel.find({})
        res.status(200).send({
            success: true,
            message: 'users data',
            data: users
        });
    } catch(err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: 'error while fetching users',
            err
        })
    }
}

const getAllDoctorsController = async( req, res ) => {
    try{
        if (!req.roles?.includes(5150)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        const doctors = await doctorsModel.find({})
        res.status(200).send({
            success: true,
            message: 'doctors data',
            data: doctors
        });
    } catch(err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: 'error while fetching doctors',
            err
        })
    }
}

const changeAccountStatusController = async( req, res ) => {
    try{
        const {doctorsId, status} = req.body
        const doctor = await doctorsModel.findByIdAndUpdate(doctorsId, {status})  
        await usersModel.findByIdAndUpdate(
            doctor.userId,
            {
                $set: { isDoctor: true },
                $push: {
                    notification: {
                        type: "doctors-account-requested-updated",
                        message: "Your Doctors Account Request has approved",
                        path: "/notifications"
                    }
                }
            },
            { new: true }
        );
    } catch(err){
        console.log(err)
        res.status(500).send({
            success: false,
            message: "Error in Account Status change",
            err
        })
    }
}
const removeDoctorController = async(req, res) => {
    try{
        const {doctorsId} = req.body
        console.log(doctorsId)
        const doctor = await doctorsModel.findOne({userId: doctorsId})
        await doctor.deleteOne();
        await appointmentModel.updateMany({doctorId: doctorsId},
            {
                $set: {
                    status: "Canceled",
                    date: null,
                    time: null
                },
            },
        )
        await usersModel.findByIdAndUpdate(doctorsId,
            {
                $set: {isDoctor: false},
                $push: {
                    notification:{
                        type: "doctors-account-update",
                        message: "You have been remove as a Doctor",
                        path: "/notifications"
                    }
                }
            },
            {new: true}
        );
        res.status(204).json({
            success: true,
            message: "Remove SuccessFully!"
        })
    } catch(err){
        console.log(err)
        res.status(500).json({
            success: false,
            message: 'Failed to Remove Doctor',
        })
    }
}
const getAllAppointments = async( req, res ) => {
    try {
    const appointments = await appointmentModel.find().populate('doctorInfo').populate('userInfo');
    if(!appointments) return res.sendStatus(204).json({'message':'No Appointments found'});
    res.status(200).json({
        success: true,
        data: appointments
    });
    }catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch appointments',
        });
    }
}
const deleteAppointments = async ( req, res ) => {
    const { appointmentsId } = req.body
    console.log(req.body)
    try{
        const appointments = await appointmentModel.findById(appointmentsId)
        console.log(appointments)
        if(!appointments) return res.status(204).json({"message": `No appointments found match ${appointmentsId}`})
        const result = await appointments.deleteOne()
        res.status(204).json({
            success: true,
            message: "Delete Successfully",
            data: result
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            success: false,
            message: "Invalid"
        })
    }
}

module.exports = {
    getAllDoctorsController, 
    getAllUsersController, 
    changeAccountStatusController,
    removeDoctorController, 
    getAllAppointments,
    deleteAppointments,
}