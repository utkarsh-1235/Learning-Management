const express = require('express')

const authRoute = express.Router();

const authmiddleware = require('../Middleware/middleware')
const upload = require('../Middleware/multer.middleware')

const {register,
       login,
       logout,
       getprofile,
       forgotPassword,
       resetPassword} = require('../Controllers/userAuthController.js')


authRoute.post('/register', upload.single("avatar"),register);
authRoute.post('/login', login);
authRoute.post('/logout', logout);
authRoute.get('/me',)
authRoute.post("/reset", forgotPassword);
authRoute.post("/resetpassword/:token", resetPassword);




module.exports = authRoute;