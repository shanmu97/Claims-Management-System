const User = require('../Model/userModal')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const logger = require('../logger')

const registerUser = asyncHandler(async (req,res) =>{
    const {name,email,password,phone,role}= req.body
    logger.info(`Registration request received for email: ${email}, role: ${role}`);

    if(!name || !email || !password || !phone || !role ){
        logger.warn(`Registration failed: Missing fields for email: ${email}`);
        res.status(400)
        throw new Error("Please add all fields")
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if(!emailRegex.test(email)){
        logger.warn(`Registration failed: Invalid email format: ${email}`);
        res.status(400)
        throw new Error("Enter correct email")
    }
    if(password.length<=8 ||password.length>=16){
        logger.warn(`Registration failed: Password length constraint violated for email: ${email}`);
        res.status(400)
        throw new Error("Password length should be between 8 and 16")
    }
    if(phone.length!==10){
        logger.warn(`Registration failed: Invalid phone length for email: ${email}`);
        res.status(400)
        throw new Error("Enter correct phone number")
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#^\\-_])[A-Za-z\d@$!%*?&#^\\-_]{8,16}$/
    if(!passwordRegex.test(password)){
        logger.warn(`Registration failed: Password complexity rules violated for email: ${email}`);
        res.status(400)
        throw new Error("Password should contain atleast one Uppercase,one Lowercase, one Number, one Special Charanter.")
    }

    const userExists = await User.findOne({email})
    if(userExists){
        logger.warn(`Registration failed: User already exists for email: ${email}`);
        res.status(400)
        throw new Error("User Exists")
    }
    const salt  = await bcrypt.genSalt(10)
    const hashPass = await bcrypt.hash(password,salt)
    const user =await User.create({
        name,email,password:hashPass,phone,role
    })
    if(user){
        logger.info(`User successfully registered: ${email} (ID: ${user.id})`);
        res.json({
            id:user.id,
            name,
            email,
            token:generateToken(user.id)
        })
    }else{
        logger.error(`User creation failed in database for email: ${email}`);
        res.status(401)
        throw new Error("Register User")
    }
})

const loginUser = asyncHandler(async (req,res) =>{
    const {email,password} = req.body
    logger.info(`Login attempt for email: ${email}`);

    const user = await User.findOne({email})
    if(user && await bcrypt.compare(password,user.password)){
        logger.info(`Successful login for email: ${email} (ID: ${user.id})`);
        res.status(200).json({
            id:user.id,
            name:user.name,
            email:user.email,
            role:user.role,
            phone:user.phone,
            token:generateToken(user.id)
        })
    }else{
        logger.warn(`Login failed: Invalid credentials for email: ${email}`);
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
    logger.info(`Retrieving user info for user ID: ${req.user.id}`);
    const {_id,name,email,role,phone}= await User.findById(req.user.id)
    res.json({
        id:_id,
        name,
        email,
        role,
        phone
    })
})
const editUser = asyncHandler(async (req,res)=>{
    const id = req.user.id
    logger.info(`Updating profile for user ID: ${id}`);
    const updateUser = await User.findByIdAndUpdate(id,req.body,{new:true})
    logger.info(`Profile updated successfully for user ID: ${id}`);
    res.status(200).json(updateUser)
})

module.exports={
    registerUser,loginUser,getUser,editUser
}
