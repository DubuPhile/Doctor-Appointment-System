const User = require('../models/userModels');

const handleLogout = async (req, res) => {
    //On client, also delete the accessToken

    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;
    //If refresh token in DB?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if(!foundUser) {
        res.clearCookie('jwt', {httpOnly: true, samesite: 'None',secure: true });
        return res.sendStatus(204);
    }
    
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);
    res.clearCookie('jwt', {httpOnly: true, samesite: 'None',secure: true }); // sercure: true - only serves on https
    res.sendStatus(204);
}       

module.exports = {handleLogout};