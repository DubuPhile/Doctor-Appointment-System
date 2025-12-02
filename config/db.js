const mongoose = require('mongoose')
const colors = require('colors')

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.DATABASE_URI);
        console.log(`Mongodb connected ${mongoose.connection.host}`.bgGreen.white)
    } catch (err){
        console.error(err);
    }
}

module.exports = connectDB