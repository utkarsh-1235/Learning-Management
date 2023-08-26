const userModel = require('../Models/userSchema.js')
const emailValidator = require('email-validator')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const cloudinary = require('cloudinary')
const AppError = require('../Utils/error.utils.js')
const fs = require('fs/promises')


const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  httpOnly: true,
  secure: true
}
/******************************************************
 * @Register
 * @route /api/auth/signup
 * @method POST
 * @description singUp function for creating new user
 * @body name, email, password, confirmPassword
 * @returns User Object
 ******************************************************/

const register = async(req, res, next)=>{
    const {fullName, email, password, avatar } = req.body;
    console.log(fullName, email, password, avatar);

      /// every field is required
    if(!fullName || !email || !password){
        return next(new AppError("Every field is required", 400));
    }
    const userExists = await userModel.findOne({ email});

    if(userExists){
       return next( new AppError("Email already exists", 400));
    }

    const user = await userModel.create({
       fullName,
       email,
       password,
       avatar: {
         public_id: email,
         secure_url: 'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg'
       }
    });

    if(!user){
      return next(new AppError('User registration failed, please try again', 400));
    }

    console.log('File Details > ', JSON.stringify(req.file));
    if(req.file){
      try{
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: 'lms',
            width: 100,
            height: 100,
            gravity: 'faces',
            crop: 'fill'
        });

        if(result) {
          user.avatar.public_id = result.public_id;
          user.avatar.secure_url = result.secure_url;

          // Remove file from server
          fs.rm(`uploads/${req.file.filename}`)
        }
      }
      catch(e){
        return next(new AppError(e || 'File not uploaded, please try again',500 ))
      }
    }
    await user.save();

    user.password = undefined;

    const token = await user.jwtToken();

    res.cookie('token', token, cookieOptions)

    res.status(201).json({
      success: true,
      message: 'User registered successfully', 
      user,
    })
     
  };


/******************************************************
   * @login
   * @route /api/auth/user
   * @method GET
   * @description retrieve user data from mongoDb if user is valid(jwt auth)
   * @returns User Object
   ******************************************************/
  
const login = async (req, res, next) => {
  
  try {
    const {email, password } = req.body;
  
    console.log(email, password);

    if(!email || !password){
      return next(new AppError('All fields are required', 400));
    }
    const user = await userModel.findOne({
      email
    }).select('+password');

    if(!user || !user.comparePassword(password)){
      return next(new AppError('Email or password does not match', 400));
    }

    const token = await user.JWTToken();
     user.password = undefined;

     res.cookie('token', token, cookieOptions);

     res.status(200).json({
      success: true,
      message: 'User loggedin successfully',
      user
     });
  } catch (error) {
    return next(new AppError(e.message, 500));
  }
};


  /******************************************************
   * @LOGOUT
   * @route /api/auth/logout
   * @method GET
   * @description Remove the token form  cookie
   * @returns logout message and cookie without token
   ******************************************************/
  
  const logout =  (req, res) => {
    res.cookie('token', null, {
      secure: true,
      maxAge: 0,
      httpOnly: true
    });

    res.status(200).json({
      success: true,
      message: 'User logged out successfully'
    })
  };

  /************
   * @GetUserProfile
   * @route /
   * @method Get
   * @description get the user profile
   */

  const getprofile = async(req, res)=>{
     try{
       const userId = req.user.id;
       const user = await userModel.findById(userId);

       res.status(200).json({
        success: true,
        message: 'User details',
        user
       });
     } catch(e){
      return next(new AppError('Failed to fetch profile',500));
     }
  };
/******************************************************
 * @FORGOTPASSWORD
 * @route /api/auth/forgotpassword
 * @method POST
 * @description get the forgot password token
 * @returns forgotPassword token
 ******************************************************/

const forgotPassword = async (req, res, next) => {
    const email = req.body.email;
  
    // return response with error message If email is undefined
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }
  
    try {
      // retrieve user using given email.
      const user = await userModel.findOne({
        email
      });
  
      // return response with error message user not found
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "user not found 🙅"
        });
      }
  
      // Generate the token with userSchema method getForgotPasswordToken().
      const forgotPasswordToken = user.getForgotPasswordToken();
  
      await user.save();
  
      return res.status(200).json({
        success: true,
        token: forgotPasswordToken
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  



  /******************************************************
   * @RESETPASSWORD
   * @route /api/auth/resetpassword/:token
   * @method POST
   * @description update password
   * @returns User Object
   ******************************************************/
  
  const resetPassword = async (req, res, next) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
  
    // return error message if password or confirmPassword is missing
    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "password and confirmPassword is required"
      });
    }
  
    // return error message if password and confirmPassword  are not same
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "password and confirm Password does not match ❌"
      });
    }
  
    const hashToken = crypto.createHash("sha256").update(token).digest("hex");
  
    try {
      const user = await userModel.findOne({
        forgotPasswordToken: hashToken,
        forgotPasswordExpiryDate: {
          $gt: new Date() // forgotPasswordExpiryDate() less the current date
        }
      });
  
      // return the message if user not found
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid Token or token is expired"
        });
      }
  
      user.password = password;
      await user.save();
  
      return res.status(200).json({
        success: true,
        message: "successfully reset the password"
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
  
  
  
  
module.exports = {register,
                  login, 
                  logout,
                  getprofile,
                  forgotPassword,
                  resetPassword,
                  
                  }