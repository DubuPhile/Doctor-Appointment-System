const userModel = require('../models/userModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieOptions = require('./cookieOption');
const doctorsModel = require ('../models/doctorsModels');
const appointmentModel = require('../models/appointmentModel');
const moment = require('moment');

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
         }).select("+password +refreshToken").exec();
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
                        "isDoctor": foundUser.isDoctor,
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
        const existingDoctor = await doctorsModel.findOne({
            userId: req.user.id, // from auth middleware
        });

        if (existingDoctor) {
            return res.status(409).json({
                success: false,
                message: "You have already applied for a doctor account",
            });
        }
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
            userId: req.user.id,
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
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Doctor application already exists",
            });
        }
        else{
        res.status(500).json({ success: false, message: error.message });
        }
    }
};
// get the Notifications
const getUserNotifications = async (req, res) => {
  try {
    if (!req.user.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      })
    }

    const user = await userModel
      .findOne({ user: req.user.user });
      
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }
    //to mark all Notifications as Read
    const { markAsRead } = req.query;

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
    //to delete all Read notification
    const { deleteRead } = req.query;

    if( deleteRead === 'true') {
        user.notification = [];
        user.seenNotification = [];
        await user.save();
        user.password = undefined;

        return res.status(200).json({
        success: true,
        message: "Notifications Deleted SuccessFully",
        notification: [],
        seenNotification: [],
        password: undefined,
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

const getApprovedDoctorController = async( req, res ) => {
    try{
        const doctors = await doctorsModel.find({status: "approved"})
        res.status(201).send({
            success: true,
            message: "Fetch Doctors data Successfully",
            data: doctors,
        })
    }catch(err){
        console.log(err),
        res.status(500).send({
            success:false,
            err,
            message: "Error While fetching Approved Doctors"
        })
    }
}
//fetch book appointment
const bookAppointmentController = async( req, res ) => {
    try{
        // Convert date & time to ISO for comparison/storage
        const appointmentDate = moment(req.body.date, 'DD-MM-YYYY').toISOString();
        const appointmentTime = moment(req.body.time, 'HH:mm').toISOString();

        // Check if appointment already exists
        const existing = await appointmentModel.exists({
            doctorId: req.body.doctorId,
            date: appointmentDate,
            time: appointmentTime
        });

        if (existing) {
            return res.status(409).send({
                success: false,
                message: 'Time slot already booked'
            });
        }
        // Create new appointment
        req.body.date = appointmentDate;
        req.body.time = appointmentTime;
        req.body.status = "pending"
        console.log(req.body.doctorId)
        const newAppointment = new appointmentModel(req.body)
        await newAppointment.save();
        const user = await userModel.findById( req.body.doctorInfo.userId );
        user.notification.push({
            type: "New-appointment-request",
            message:`A new appointment Request from ${req.body.userInfo.user}`,
            path: '/user/appointments'
        })
        await user.save();
        res.status(200).send({
            success: true,
            message: 'Appointment book Successfully'
        })
    } catch(err){
        console.log(err)
        res.status(500).send({
            success: false,
            err,
            message:"Error to Book an Appointment"
        })
    }
}
//fetch Availability
const bookAvailabilityController = async( req, res ) => {
    try{
        const { date, time, doctorId } = req.body;
        const appointmentMoment = moment(time, "HH:mm");
        const appointmentMinutes =
            appointmentMoment.hours() * 60 + appointmentMoment.minutes();

        // Doctor start & end times
        const doctor = await doctorsModel.findOne({userId: doctorId});
        if (!doctor) {
            return res.status(404).send({
            success: false,
            message: "Doctor not found"
            });
        }
        const doctorStart = moment(doctor.timings[0]);
        const doctorEnd = moment(doctor.timings[1]);

        const startMinutes =
            doctorStart.hours() * 60 + doctorStart.minutes();
        const endMinutes =
            doctorEnd.hours() * 60 + doctorEnd.minutes();

        // Outside doctor working hours
        if (
            appointmentMinutes < startMinutes ||
            appointmentMinutes > endMinutes
        ) {
            return res.status(200).send({
            success: true,
            message: "Doctor is not available at this time"
            });
        }
        const appointmentDateTime = moment(
            `${date} ${time}`,
            "DD-MM-YYYY HH:mm"
        );
        const fromTime = appointmentDateTime
            .clone()
            .subtract(59, "minute")
            .toISOString();

        const toTime = appointmentDateTime
            .clone()
            .add(1, "hour")
            .toISOString();
        console.log(fromTime)
        console.log(toTime)
        const appointments = await appointmentModel.exists({
            doctorId, 
            date: moment(date, "DD-MM-YYYY").toISOString(), 
            time: {
                $gte:fromTime, $lte: toTime
            }
        })
        console.log(appointments)
        return res.status(200).send({
            success: true,
            message: appointments ? 'Time slot already booked'
                                        : "Appointments Available"
            })
    }catch(err){
        console.log(err)
        res.status(500).send({
            success: false,
            err,
            message: "Error Fetching Availability"
        })
    }
}

const userAppointmentsController = async( req, res ) => {
    try{
        const {userId} = req.query
        const appointments = await appointmentModel.find({userId: userId}).populate('doctorInfo').populate('userInfo');
        console.log(appointments.time)
        res.status(200).send({
            success: true,
            message: "Users Appointments Fetch Successfully",
            data: appointments,
        });
    } catch(err){
        console.log(err)
        res.status(500).send({
            success:false,
            err,
            message:"Error in User Appointment"
        })
    }
};
module.exports = {
    loginController, 
    registerController, 
    applyDoctorController, 
    getUserNotifications, 
    getApprovedDoctorController,
    bookAppointmentController,
    bookAvailabilityController,
    userAppointmentsController,
}