require('dotenv').config();
const express = require('express')
const colors = require('colors')
const morgan = require('morgan')
const connectDB = require('./config/db')
const cors = require('cors');
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT')
const credentials = require('./middleware/credentials')

const PORT = process.env.PORT || 3500

//Database connection
connectDB();

const app = express()

app.use(credentials);
app.use(cors(corsOptions));

app.use(express.urlencoded({extended: false}));

//middleware
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

//routes
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/refresh', require('./routes/refreshToken'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);
app.use('/users', require('./routes/api/Users'))

app.all('{*splat}', (req, res) => {
    res.status(404);
    if (req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    else if (req.accepts('json')){
        res.json({ error: '404 Not Found'});
    }
    else {
        res.type('txt').send('404 Not Found');
    }
    
});

app.listen(PORT, () => {
    console.log(
        `Server Running in ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white
    )
})

// mongoose.connection.once('open', () =>{
//     console.log('Connected to MongoDB');
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// });
