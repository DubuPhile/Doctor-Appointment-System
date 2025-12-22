const doctorsModel = require('../models/doctorsModels')

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

module.exports = { getDoctorInfoController }