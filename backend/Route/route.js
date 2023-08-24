const express = require('express')

const authRoute = express.Router();



const {signUp,
signIn} = require('../Controllers/Controller.js')


authRoute.post('/signUp', signUp);
authRoute.post('/signIn', signIn);

module.exports = authRoute;