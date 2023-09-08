const express = require('express')
const app = new express();
const authRoute = require('./Route/route')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const morgan = require('morgan');
const errorMiddleware = require('./Middleware/error.middleware')


app.use(express.json()); // Built-in middleware
app.use(cookieParser());   // Third-party middleware

app.use(morgan('dev'));
app.use(cors({ origin: [process.env.CLIENT_URL], credentials: true })); //Third-party middleware

//auth Router
app.use('/api/auth',authRoute);
app.use('/',(req, res)=>{
    res.status(200).json({data: 'JWTauth'})
});

app.all('*',(req, res)=>{
    res.status(400).json('OOPS 404 not found')
})

app.use(errorMiddleware);
module.exports = app;