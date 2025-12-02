require('dotenv').config();
const express = require('express')
const colors = require('colors')
const morgan = require('morgan')
const connectDB = require('./config/db')
const cors = require('cors');

const PORT = process.env.PORT || 3500

//Database connection
connectDB();

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

//middleware
app.use(express.json())
app.use(morgan('dev'))

//routes
app.use('/register', require('./routes/register'))

app.listen(PORT, () => {
    console.log(
        `Server Running in ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white
    )
})

// mongoose.connection.once('open', () =>{
//     console.log('Connected to MongoDB');
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// });
