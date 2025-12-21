const doctorsModel = require ('../models/doctorsModels')
const usersModel = require ('../models/userModels')

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


module.exports = {getAllDoctorsController, getAllUsersController, changeAccountStatusController}