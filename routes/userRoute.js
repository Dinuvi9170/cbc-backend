import express from 'express';
import { createUser,
    getAllusers,
    getUserbyId,
    loginUser, 
    loginWithGoogle, 
    ResetPassword, 
    sendOTP, 
    updateProfile } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.route('/').post(createUser).get(getAllusers);
userRouter.post('/login',loginUser);
userRouter.post('/login/google',loginWithGoogle);
userRouter.post('/sendOTP',sendOTP);
userRouter.post('/reset_password',ResetPassword);
userRouter.route('/:userId').get(getUserbyId);
userRouter.put('/:email',updateProfile);

export default userRouter;