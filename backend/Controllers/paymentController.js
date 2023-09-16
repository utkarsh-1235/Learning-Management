const paymentModel = require('../Models/paymentmodel');
const AppError = require('../Utils/error.utils');
const userModel = require('../Models/userSchema');
const crypto = require('crypto');
const razorpay = require('../index');

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
     try{
          const id = req.user;
          const user = await userModel.findById({id});
      
          if(!user){
           return next(new AppError("Unauthorized, please login"));
          }
      
          if(user.role === 'ADMIN'){
           return next(new AppError("Admin cannot purchase a subscription", 400));
          }
      
          const subscription = await razorpay.subscriptions.create({
           plan_id: process.env.RAZORPAY_PLAN_ID,
           customer_notify: 1,
          })
      
          user.subscription.id = subscription.id;
          user.subscription.status = subscription.status;
      
          await user.save();
      
          res.status(200).json({
           success: true,
           message: "Subscribed Successfully",
           subscription_id: subscription.id,
         });
     }
     catch(err){
           return next(new AppError(err.message, 500));
    }
   
}


const verifySubscription = async(req, res, next)=>{
     try{
          const id = req.user;

          const {
             Razorpay_payment_id,
             Razorpay_signature,
             Razorpay_subscription_id
      
          } = req.body;
      
          const user = await userModel.findById(id)
      
          if(!user){
           return next(new AppError("Unauthorized, please login"));
          }
      
          const subscriptionId = user.subscription.id;
      
          const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
          .upsate(`${razorpay_payment_id}|${subscriptionId}`)
          .digest("hex");
      
          if(generatedSignature != Razorpay_signature){
           return next(new AppError("Payment not verified, please try again", 500));
          }
          await Payment.create({
           razorpay_payment_id,
           razorpay_signature,
           razorpay_subscription_id,
         });
      
         user.subscription.status = "active";
         await user.save();
      
         res.status(200).json({
           success: true,
           message: "Payment verified successfully!",
         });
     }
     catch(err){
          return next(new AppError(e.message, 500));
     }
    
}

const cancelSubscription = async(req, res, next)=>{
     try{
          const {id} = req.user;

          const user = await userModel.findById(id);
      
          if(!user){
           return next(new AppError("Unauthorized, please login")); 
          }
          
          const subscriptionId = user.subscription.id;
      
          const subscription = await razorpay.subscriptions.cancel(subscriptionId);
      
          user.subscription.status = subscription.status;
          await user.save();
     }
     catch(err){
          return next(new AppError(e.message, 500));
     }
    
}
const allPayments = async(req, res, next)=>{
   
 try{

     const { count } = req.query;

     const subscriptions = await razorpay.subscriptions.all({
          count: count || 10,
     })
     res.status(200).json({
          success: true,
          message: 'All payments are', subscriptions
     })
 }   
 catch(err){
     return next(new AppError(e.message, 500));
 }
    
}


module.exports = {
                 getRazorpayApiKey, 
                 buySubscription, 
                 verifySubscription, 
                 cancelSubscription, 
                 allPayments

}