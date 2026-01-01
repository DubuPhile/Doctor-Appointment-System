const userModel = require('../models/userModels');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async(req, res) => {
    const cookies = req.cookies
    if(!cookies?.refreshToken) return res.sendStatus(401);
    const refreshToken = cookies.refreshToken;
    const foundUser = await userModel.findOne({ refreshToken }).exec();
    if(!foundUser) return res.sendStatus(403);//Forbidden
    //evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || foundUser.user !== decoded.user) return res.sendStatus(403);
            const roles = Object.values(foundUser.roles).filter(Boolean);

            const accessToken = jwt.sign(
                {
                    "UserInfo":{
                        "_id":foundUser._id,
                        "user": foundUser.user,
                        "isDoctor": foundUser.isDoctor,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn:'1h'}
            );
            res.json({ accessToken });
        }
        
    )
   
}       

module.exports = {handleRefreshToken};