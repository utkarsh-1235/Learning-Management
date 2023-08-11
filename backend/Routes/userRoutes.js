import {Router} from 'express'
const authRouter = Router();

import jwtAuth from '../Middleware/JwtAuthMiddleware.js'

import {
  register,
  signIn,
  forgotPassword,
  getUser,
  resetPassword,
  logout
} from '../Controllers/usreController.js'

authRouter.post("/register", register);
authRouter.post("/signin", signIn);
authRouter.post("/forgotpassword", forgotPassword);
authRouter.post("/resetpassword/:token", resetPassword);

authRouter.get("/user", jwtAuth, getUser);
authRouter.get("/logout", jwtAuth, logout);

export default authRouter
