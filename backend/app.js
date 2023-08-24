const express = require('express')
const app = new express();
const authRoute = require('./Route/route')
const dbConnect = require('./Config/db')
const cookieParser = require('cookie-parser')
const cors = require('cors')

//database connection
dbConnect();

 app.use(express.json()); // Built-in middleware
// app.use(cookieParser()); // Third-party middleware

// app.use(cors({ origin: [process.env.CLIENT_URL], credentials: true })); //Third-party middleware

//auth Router
app.use('/api/auth',authRoute);
app.use('/',(req, res)=>{
    res.status(200).json({data: 'JWTauth'})
});

module.exports = app;