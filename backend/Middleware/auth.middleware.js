const AppError = require('../Utils/error.utils');
const jwt = require('jsonwebtoken');

const isLoggedIn = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new AppError('Unauthenticated, please login again', 401));
    }

    const userDetails = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = userDetails;

    next();
}

const authorizedRoles = (...roles) => async (req, res, next) => {
    const currentUserRole = req.user.role;
    if (!roles.includes(currentUserRole)) {
        return next(
            new AppError('You do not have permission to access this route', 403)
        )
    }
    next();
}

const authorizeSubscriber = async(req, res, next) => {
    const subscription = req.user.subscription;
    const currentUserRole = req.user.role;
    if (currentUserRole !== 'ADMIN' && subscription.status !== 'active') {
        return next(
            new AppError('Please subscribe to access this route!', 403)
        )
    }

    next();
}

module.exports = {
    isLoggedIn,
    authorizedRoles,
    authorizeSubscriber
}

// const JWT = require("jsonwebtoken");
// //require('dotenv').config();

// // router level middleware function
// const jwtAuth = (req, res, next) => {
//   // get cookie token(jwt token generated using json.sign()) form the request
//   const token = (req.cookies && req.cookies.token) || null;

//   // return response if there is no token(jwt token attached with cookie)
//   if (!token) {
//     return res.status(400).json({ success: false, message: "NOT authorized" });
//   }

//   // verify the token
//   try {
//     const payload = JWT.verify(token, process.env.SECRET);
//     req.user = { id: payload.id, email: payload.email };
//   } catch (error) {
//     return res.status(400).json({ success: false, message: error.message });
//   }
//   next();
// };

// module.exports = jwtAuth;
