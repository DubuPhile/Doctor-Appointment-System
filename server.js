require('dotenv').config();
const express = require('express')
const colors = require('colors')
const morgan = require('morgan')

const PORT = process.env.PORT || 3500

const app = express()

//middleware
app.use(express.json())
app.use(morgan('dev'))

//routes
app.get('/', (req, res) => {
    res.status(200).send({
        message: "server running",
    })
})

app.listen(PORT, () => {
    console.log(
        `Server Running in ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white
    )
})

// mongoose.connection.once('open', () =>{
//     console.log('Connected to MongoDB');
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// });
