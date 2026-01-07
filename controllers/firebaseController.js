const admin = require('../config/firebaseAdmin');
const User = require('../models/userModels');
const jwt = require('jsonwebtoken');

const firebaseLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name } = decodedToken;

    let foundUser = await User.findOne({ email }).select('+authProviderId');
    if (!foundUser) {
      foundUser = await User.create({
        user: name,
        email,
        authProviderId: uid,
        authProvider: 'firebase',
      });
    }
    // 5. Create JWTs
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
        { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
        { "user": foundUser.user },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    // 6. Save refresh token
    foundUser.refreshToken = refreshToken;
    await foundUser.save();


    // 7. Send cookie
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
    });

    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Firebase authentication failed' });
  }
};

module.exports = { firebaseLogin };