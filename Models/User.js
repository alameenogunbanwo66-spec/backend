const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName : {
        type : String,
        required : true,
        trim : true
    },
    lastName : {
        type : String,
        required : true,
        trim : true,
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        lowercase : true,
    },
    phoneNumber : {
        type : String,
        required : true,
        trim : true,
        unique : true,      
    },
    password : {
        type : String,
        required : true,
    },
    resetToken : String,
    resetTokenExpiry : Date,
}, { timestamps : true})

const USER = mongoose.model("User", userSchema)
module.exports = USER
