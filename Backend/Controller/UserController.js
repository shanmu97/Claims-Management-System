const User = require('../Model/userModal')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const registerUser = asyncHandler(async (req,res) =>{
    const {name,email,password,phone,role}= req.body

    if(!name || !email || !password || !phone || !role ){
        res.status(400)
        throw new Error("Please add all fields")
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if(!emailRegex.test(email)){
        res.status(400)
        throw new Error("Enter correct email")
    }
    if(password.length<=8 ||password.length>=16){
        res.status(400)
        throw new Error("Password length should be between 8 and 16")
    }
    if(phone.length!==10){
        res.status(400)
        throw new Error("Enter correct phone number")
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#^\\-_])[A-Za-z\d@$!%*?&#^\\-_]{8,16}$/
    if(!passwordRegex.test(password)){
        res.status(400)
        throw new Error("Password should contain atleast one Uppercase,one Lowercase, one Number, one Special Charanter.")
    }

    const userExists = await User.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error("User Exists")
    }
    const salt  = await bcrypt.genSalt(10)
    const hashPass = await bcrypt.hash(password,salt)
    const user =await User.create({
        name,email,password:hashPass,phone,role
    })
    if(user){
        res.json({
            id:user.id,
            name,
            email,
            token:generateToken(user.id)
        })
    }else{
        res.status(401)
        throw new Error("Register User")
    }

    res.json({message:"Register User."})
})

const loginUser = asyncHandler(async (req,res) =>{
    const {email,password} = req.body
    const user = await User.findOne({email})
    if(user && await bcrypt.compare(password,user.password)){
        res.status(200).json({
            id:user.id,
            name:user.name,
            email:user.email,
            role:user.role,
            token:generateToken(user.id)
        })
    }else{
        res.status(401)
        throw new Error("Invalid Credentials")
    }
})

const generateToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'30d'
    })
}
const getUser = asyncHandler(async (req,res)=>{
    const {_id,name,email,role}= await User.findById(req.user.id)
    res.json({
        id:_id,
        name,
        email,
        role
    })
})
const editUser = asyncHandler(async (req,res)=>{
    const id = req.user.id
    const updateUser = await User.findByIdAndUpdate(id,req.body,{new:true})
    res.status(200).json(updateUser)
})

module.exports={
    registerUser,loginUser,getUser,editUser
}