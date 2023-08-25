const userModel = require('../Models/userSchema.js')
const emailValidator = require('email-validator')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

/******************************************************
 * @SIGNUP
 * @route /api/auth/signup
 * @method POST
 * @description singUp function for creating new user
 * @body name, email, password, confirmPassword
 * @returns User Object
 ******************************************************/

const register = async(req, res, next)=>{
    const {fullName, email, password } = req.body;
    console.log(name, email, password);

      /// every field is required
    if(!fullName || !email || !password){
        return res.status(400).json({
            success: false,
            message: "Every field is required"
        })
    }
    const userExists = await User.findOne({ email});

    if(userExists){
       return res.status(400).json({
        success: false,
        message: 'Email already exists'
       })
    }

    const user = await User.create({
       fullName,
       email,
       password,
       avatar: {
         public_id: email,
         secure_url: 'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg'
       }
    });

    if(!user){
      return res.status(400).json({
         success: false,
         message: 'User registration failed, please try again'
      })
    }

    console.log('File Details > ', JSON.stringify(req.file));
    if(req.file){
      try{
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder: 'lms',
            width: 250,
            height: 250,
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
        return res.status(500).json({
           success: false,
           message: err.message ||'File not uploaded, please try again'
        })
      }
    }
    await user.save();

    user.password = undefined;

    const token = await user.generateJWTToken();

    res.cookie('token', token, cookieOptions)

    res.status(201).json({
      success: true,
      message: 'User registered successfully', 
      user,
    })
     
  };



const signIn = async function(req, res, next){
    const { email, password } = req.body;

    if(!email || !password){
      return res.status(400).json({
         success:false,
         message:"email and password are required"
      })
    }

    try{
     const user = await userModel
     .findOne({
      email
     })
     .select("+password")
      
   //If user not exist and password not matches to actual password then show error

     if(!user || !await bcrypt.compare(password, user.password )){
           return res.status(400).json({
              success: false,
              message:"invalid credentials"
           })
     }

      

// Generate token
     const token = user.jwtToken()
     user.password = undefined

     const cookieOption = {
      maxAge: 24*60*60*1000,
      httpOnly: true
     }
     res.cookie("token", token, cookieOption);
     res.status(200).json({
      success : true,
      data : user
     })
     
}

    catch(err){
         res.status(400).json({
             success : false,
             message : `ERROR ${err.message}`
         })
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
  
  /******************************************************
   * @LOGOUT
   * @route /api/auth/logout
   * @method GET
   * @description Remove the token form  cookie
   * @returns logout message and cookie without token
   ******************************************************/
  
  const logout = async (req, res, next) => {
    try {
      const cookieOption = {
        expires: new Date(), // current expiry date
        httpOnly: true //  not able to modify  the cookie in client side
      };
  
      // return response with cookie without token
      res.cookie("token", null, cookieOption);
      res.status(200).json({
        success: true,
        message: "Logged Out"
      });
    } catch (error) {
      res.stats(400).json({
        success: false,
        message: error.message
      });
    }
  };
  
  /******************************************************
   * @GETUSER
   * @route /api/auth/user
   * @method GET
   * @description retrieve user data from mongoDb if user is valid(jwt auth)
   * @returns User Object
   ******************************************************/
  
  const getUser = async (req, res, next) => {
    const userId = req.user.id;
    try {
      const user = await userModel.findById(userId);
      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

module.exports = {register, 
                  signIn,
                  forgotPassword,
                  getUser,
                  resetPassword,
                  logout
                  }