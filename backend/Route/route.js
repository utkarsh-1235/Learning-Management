const express = require('express')

const authRoute = express.Router();


const upload = require('../Middleware/multer.middleware');

const {isLoggedIn} = require('../Middleware/auth.middleware');

const {register,
       login,
       logout,
       getprofile,
       forgotPassword,
       resetPassword} = require('../Controllers/userAuthController.js')


authRoute.post('/register', upload.single("avatar"), register);
authRoute.post('/login', login);
authRoute.post('/logout', logout);
authRoute.get('/me', isLoggedIn, getprofile);
authRoute.post("/reset", forgotPassword);
authRoute.post("/resetpassword/:token", resetPassword);




module.exports = authRoute;