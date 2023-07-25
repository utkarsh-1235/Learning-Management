import model from '../Models/userModels.js'


const register = async(req,res,next)=>{
   const {name, email, password} = req.body

   if(!name || !email || !password){
    return next(new AppError('All fields are required', 400))
   }

   const userExists = await model.findOne({email})

   if(userExists){
    return next(new AppError('User already exists', 400))
   }

   const user = await model.create({
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
   res.status(201).json({
     success: true,
     message: "user registered successfully",
     user
   })
}
const login = (req,res)=>{
    
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