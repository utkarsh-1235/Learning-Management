const userModel = require('../Models/userSchema.js')
const emailValidator = require('email-validator')
const bcrypt = require('bcrypt')

/******************************************************
 * @SIGNUP
 * @route /api/auth/signup
 * @method POST
 * @description singUp function for creating new user
 * @body name, email, password, confirmPassword
 * @returns User Object
 ******************************************************/

const signUp = async(req, res, next)=>{
    const {name, email, password, confirmPassword} = req.body;
    console.log(name, email, password, confirmPassword);

      /// every field is required
    if(!name || !email || !password || !confirmPassword){
        return res.status(400).json({
            success: false,
            message: "Every field is required"
        })
    }
        //validate email using npm package "email-validator"
        const validEmail = emailValidator.validate(email)

        if(!validEmail){
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address 📩"
            })
        }
        try{
                /// send password not match err if password !== confirmPassword
            if(password !== confirmPassword){
                return res.status(400).json({
                    success: false,
                    message: "password and confirm Password does not match ❌"
                })
            }
    
            // userSchema "pre" middleware functions for "save" will hash the password using bcrypt
    // before saving the data into the database
            const result = await userModel.save(req.body);
            return res.status(200).json({
                success: true,
                data: result
    
            });
        }
        catch(err){
            return res.status(400).json({
                success: false,
                message: err.message
            })
        }
    

};

/******************************************************
 * @SIGNIN
 * @route /api/auth/signin
 * @method POST
 * @description verify user and send cookie with jwt token
 * @body email , password
 * @returns User Object , cookie
 ******************************************************/
  
const signIn = async(req, res, next)=>{
            
    const {email, password} = req.body;

    // check email and password
    if(!email || !password){
        return res.status(400).json({
            success: false,
            message: "email and password are required"
        })
    }

    try{
        //check user exist or not
        const user = await userModel.findOne({email}).select('+password');
            
        // If user is null or the password is incorrect return response with error message
        if(!user || !(await bcrypt.compare(password, user.password))){
            console.log(password, user.password)
            return res.status(400).json({
                success: false,
                message: "invalid credentials"
            })
        }

        // create jwt token
        const token = user.jwtToken();
        user.password = undefined;

        const cookieOption = {
            maxAge: 24*60*60*1000, // 24h
            httpOnly: true  // not able to modify  the cookie in client side
        }

        res.cookie("token", token, cookieOption);
        res.status(200).json({
            success: true,
            data: user
        })
    }
    catch(err){
           return res(400).json({
            success: false,
            message: err.message
           })
    }
}
module.exports = {signUp,
signIn}