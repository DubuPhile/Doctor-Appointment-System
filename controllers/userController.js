const userModel = require('../models/userModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieOptions = require('./cookieOption');
const doctorsModel = require ('../models/doctorsModels');

//Register Controller
const registerController = async(req, res) => {
    try{
        const existingUser = await userModel.findOne({email: req.body.email})
        if(existingUser){
            return res.status(409).send({message:'User Already Exist', success: false})
        }
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        req.body.password = hashedPassword
        const newUser = new userModel(req.body)
        await newUser.save()
        res.status(201).send({message: "Register Successfully", success: true})
    }
    catch(err){
        console.log(err)
        res.status(500).send({success:false, message: `Register Controller ${err.message}`})
    } 
}

//Login Controller
const loginController = async(req, res) => {
    try{
        const { user, password } = req.body;

        const foundUser = await userModel.findOne({ 
            $or: [
                { user: user },
                { email: user }
            ]
         }).exec();
        if(!foundUser){
            return res.sendStatus(401)
        }
        const match = await bcrypt.compare(password, foundUser.password);
        if(match) {
            const roles = Object.values(foundUser.roles).filter(Boolean);
            const accessToken = jwt.sign(
                {
                    "UserInfo":{
                        "user": foundUser.user,
                        "email": foundUser.email,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn:'1d'}
            );
            const refreshToken = jwt.sign(
                {"user": foundUser.user},
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn:'1h'}
            );
            foundUser.refreshToken = refreshToken;
            const result = await foundUser.save();
            console.log(result)

            res.cookie('jwt', refreshToken, { cookieOptions , maxAge: 24 * 60 * 60 * 1000});
            res.json({ accessToken });
        }
        else {
            res.sendStatus(401)
        }
    } catch(err){
        console.log(err)
        res.status(500).send({message: `Error Login ${err.message}`})
    }
};

//apply Doctor Controller
const applyDoctorController = async( req, res ) => {
    try{
        const newDoctor = new doctorsModel({
            ...req.body,
            status: 'pending',
        })
        await newDoctor.save()
        const adminUser = await userModel.findOne({"roles.Admin": 5150})
        const notification = adminUser.notification
        notification.push({
            type:"apply-doctor-request",
            message:`${newDoctor.firstName} ${newDoctor.lastName} has Applied for a Doctor Account`,
            data:{
                doctorId: newDoctor._id,
                name: newDoctor.firstName + " "+ newDoctor.lastName,
                onClickPath:'/admin/doctors'
            }
        })
        await userModel.findByIdAndUpdate(adminUser._id,{notification})
        return res.status(201).json({
            success: true,
            message: 'Doctor Account Applied successfully',
        })

    } catch(err){
        console.error(err)
        res.status(500).send({success: false, err, message:"Error Applying Doctor"})
    }
};

const getUserNotifications = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
    }

    const user = await userModel
      .findOne({ user: req.user })
      .select('notification seenNotification');
      
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    res.status(200).json({
      success: true,
      notification: user.notification ?? [],
      seenNotification: user.seenNotification ?? [],
    })
  } catch (error) {
    console.error('Get notifications error:', error)

    res.status(500).json({
      success: false,
      message: 'Server error',
    })
  }
}


module.exports = {loginController, registerController, applyDoctorController, getUserNotifications}