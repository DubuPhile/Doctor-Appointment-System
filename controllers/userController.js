const userModel = require('../models/userModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieOptions = require('./cookieOption');

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
}


module.exports = {loginController, registerController}