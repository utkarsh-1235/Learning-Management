const paymentModel = require('../Models/paymentmodel');
const AppError = require('../Utils/error.utils');

const getRazorpayApiKey = async(req, res, next)=>{
     try{
          res.status(200).json({
              success: true,
              message: 'Razorpay API key',
              key: process.env.RAZORPAY_KEY_ID
          })
     }
     catch(err){
        return next(new AppError(err.message, 500))
     }
}

const buySubscription = async(req, res, next)=>{
    
}


const verifySubscription = async(req, res, next)=>{
    
}

const cancelSubscription = async(req, res, next)=>{
    
}


const allPayments = async(req, res, next)=>{
    
}


module.exports = {
                 getRazorpayApiKey, 
                 buySubscription, 
                 verifySubscription, 
                 cancelSubscription, 
                 allPayments

}