import User from '../Models/userModels.js'
 import AppError from "../Utils/error.util.js"

const cookieOptions = {
    maxAge: 7*24*24*60*1000,
    httpOnly: true,
    secure: true
}
const register = async(req,res,next)=>{
   const {name, email, password} = req.body
   console.log(name, email, password)

   if(!name || !email || !password){
    return next(new AppError('All fields are required', 400))
   }

   const userExists = await User.findOne({email})

   if(userExists){
    return next(new AppError('User already exists', 400))
   }

   const user = await User.create({
      fullName,
      email,
      password,
      avatar: {
        public_url: email,
        secure_url: 'https://gravatar.com/avatar/3cdf2ceab2880dc68af0510ad8e2418c?s=400&d=retro&r=pg'
    }
   })

   if(!user){
    return next(new AppError('User registration failed, try again', 400))
   }

   // To do file upload
   
   await user.save()
   user.password = undefined

   const token = await user.generate
  
   res.cookie ('token',token,cookieOptions)

   res.status(201).json({
     success: true,
     message: "user registered successfully",
     user
   })
}
const login = async(req,res)=>{
     const {email, password} = req.body   

     if(!email || !password){
      return next(new AppError('All fields are required',400))
     }
     const user = await User.findOne({
      email
     }).select('+password')

     if(!user || !user.comparePassword(password) ){
      return next(new AppError('Email or password does not match'))
     }
}

const logout = (req,res)=>{
    
}
const getProfile = (req,res)=>{
    
}

export {
    register,
    login,
    logout,
    getProfile,
}