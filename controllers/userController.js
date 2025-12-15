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
                        "_id": foundUser._id,
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
    try {

        let {
            firstName,
            lastName,
            phone,
            email,
            address,
            website,
            specialization,
            experience,
            feesPerConsultation,
            timings
        } = req.body;

        // Type conversions
        feesPerConsultation = Number(feesPerConsultation);
        if (isNaN(feesPerConsultation)) {
            return res.status(400).json({ success: false, message: "feesPerConsultation must be a number" });
        }

        // Ensure timings is an array of Dates
        if (!Array.isArray(timings)) {
            return res.status(400).json({ success: false, message: "timings must be an array" });
        }
        timings = timings.map(time => new Date(time));
        if (timings.some(time => isNaN(time.getTime()))) {
            return res.status(400).json({ success: false, message: "Invalid date in timings array" });
        }

        // Create new doctor document
        const newDoctor = new doctorsModel({
            firstName,
            lastName,
            phone,
            email,
            address,
            website,
            specialization,
            experience,
            feesPerConsultation,
            timings,
            status: 'pending'
        });

        await newDoctor.save();

        // Optional: notify admin
        const adminUser = await userModel.findOne({ "roles.Admin": 5150 });
        if (adminUser) {
            const newNotification = {
                type: "apply-doctor-request",
                message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a Doctor account`,
                data: {
                    doctorId: newDoctor._id,
                    name: newDoctor.firstName + " " + newDoctor.lastName,
                    path: "/admin/doctors",
                },
                createdAt: new Date(),
            };
            await userModel.findByIdAndUpdate(adminUser._id, {
                $push: { notification: newNotification },
            });
        }

        res.status(201).json({ success: true, message: "Doctor application submitted successfully!" });

    } catch (error) {
        console.error("Error saving doctor:", error);
        res.status(500).json({ success: false, message: error.message });
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
    const { markAsRead } = req.query;

    // ✅ If markAsRead=true → move notifications
    if (markAsRead === "true") {
      user.seenNotification.push(...user.notification);
      user.notification = [];
      await user.save();

      return res.status(200).json({
        success: true,
        message: "All notifications marked as read",
        notification: [],
        seenNotification: user.seenNotification,
      });
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