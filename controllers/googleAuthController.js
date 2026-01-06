const { OAuth2Client } = require('google-auth-library');
const User = require('../models/userModels');
const jwt = require('jsonwebtoken');
const cookieOption = require('./cookieOption');



const googleLogin = async (req, res) => {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const { token } = req.body;
    
    try {
        // 1. Verify token with Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email, name, sub: googleId } = ticket.getPayload();

        // 2. Find user
        let user = await User.findOne({ email }).select('+googleId');

        // 3. Create user if not exists
        if (!user) {
            user = await User.create({
                user: name,
                email,
                googleId,
                authProvider: 'google',
            });
        }

        // 4. Link Google if registered normally before
        if (!user.googleId) {
            user.googleId = googleId;
            user.authProvider = 'google';
            await user.save();
        }

        // 5. Create JWTs
        const roles = Object.values(user.roles).filter(Boolean);
        const accessToken = jwt.sign(
            {
                "UserInfo":{
                        "_id": user._id,
                        "user": user.user,
                        "isDoctor": user.isDoctor,
                        "roles": roles
                    }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { "user": user.user },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        // 6. Save refresh token
        user.refreshToken = refreshToken;
        await user.save();
    

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
        res.status(401).json({ message: 'Google authentication failed' });
    }
};

module.exports = { googleLogin };
