import express from 'express';
import { createUser,loginUser, loginWithGoogle, ResetPassword, sendOTP } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.route('/').post(createUser);
userRouter.post('/login',loginUser);
userRouter.post('/login/google',loginWithGoogle);
userRouter.post('/sendOTP',sendOTP);
userRouter.post('/reset_password',ResetPassword);

export default userRouter;