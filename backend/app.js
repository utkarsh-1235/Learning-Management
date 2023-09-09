const express = require('express')
const app = new express();
const userAuthRoute = require('./Route/route')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const morgan = require('morgan');
const errorMiddleware = require('./Middleware/error.middleware')


app.use(express.json()); // Built-in middleware

app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: [process.env.FRONTEND_URL], credentials: true })); //Third-party middleware

app.use(cookieParser());   // Third-party middleware

app.use(morgan('dev'));

//auth Router
app.use('/api/auth',userAuthRoute);
app.use('/',(req, res)=>{
    res.status(200).json({data: 'JWTauth'})
});

app.all('*',(req, res)=>{
    res.status(400).json('OOPS 404 not found')
})

app.use(errorMiddleware);
module.exports = app;