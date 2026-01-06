require('dotenv').config();
const mongoose = require('mongoose')
const express = require('express')
const morgan = require('morgan')
const connectDB = require('./config/db')
const cors = require('cors');
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const credentials = require('./middleware/credentials');
const path = require('path');

const PORT = process.env.PORT || 3500

//Database connection
connectDB();

const app = express()
app.set('trust proxy', 1);

app.use(credentials);
app.use(cors(corsOptions));

app.use(express.urlencoded({extended: false}));

//middleware
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

//COOP / COEP headers
app.use((req, res, next) => {
  if (!req.path.startsWith("/login")) {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  }
  next();
});

//routes
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/refresh', require('./routes/refreshToken'));
app.use('/logout', require('./routes/logout'));
app.use('/auth', require('./routes/googleAuth'));

app.use(verifyJWT);
app.use('/users', require('./routes/api/Users'))
app.use('/apply-doctor', require('./routes/applyDoctor'));
app.use('/notifications', require('./routes/getUserNotifications'));
app.use('/admin', require('./routes/AdminRoutes'));
app.use('/doctor', require('./routes/DoctorRoutes'));
app.use('/user', require('./routes/userRoutes'));


//serve static files
app.use(express.static(path.join(__dirname, 'client','dist')));
app.get('{*splat}', (req, res) => { 
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})

mongoose.connection.once('open', () =>{
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
