const Router = require('express');
const { isLoggedIn, authorizedRoles } = require('../Middleware/auth.middleware');
const { getRazorpayApiKey, buySubscription, verifySubscription, cancelSubscription, allPayments } = require('../Controllers/paymentController');
const paymentRoute = Router();

paymentRoute.route('/razorpay-key')
            .get(isLoggedIn,
                getRazorpayApiKey);

paymentRoute.route('/subscribe')              
            .post(isLoggedIn,
                buySubscription)  ;

paymentRoute.route('/verify')                
            .post(isLoggedIn,
                verifySubscription);

paymentRoute.route('/unsubscribe')                
            .post(isLoggedIn,
                cancelSubscription);

paymentRoute.route('/')                
            .get(isLoggedIn,
                authorizedRoles('ADMIN'),
                allPayments);


module.exports = paymentRoute;