const doctorsModel = require('../models/doctorsModels')

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

module.exports = { getDoctorInfoController, updateProfileController }