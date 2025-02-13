const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Enter your name"]
    },
    email:{
        type:String,
        required:[true,"Enter your email"]
    },
    phone:{
        type:String,
        required:[true,"Enter your Mobile Number"]
    },
    password:{
        type:String,
        required:[true,"Enter your password"]
    },
    role:{
        type:String,
        enum:["policyholder","admin","agent"],
        required:true
    },
},{
    timestamps:true,
}
)

module.exports = mongoose.model('User',userSchema)