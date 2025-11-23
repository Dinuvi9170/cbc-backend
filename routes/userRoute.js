import express from 'express';
import { createUser,
    getAllusers,
    getUserbyId,
    loginUser, 
    loginWithGoogle, 
    ManageAccount, 
    ResetPassword, 
    sendOTP, 
    updateProfile } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.route('/').post(createUser).get(getAllusers);
userRouter.post('/login',loginUser);
userRouter.post('/login/google',loginWithGoogle);
userRouter.post('/sendOTP',sendOTP);
userRouter.post('/reset_password',ResetPassword);
userRouter.route('/:userId').get(getUserbyId).put(updateProfile);
userRouter.route('/manage/:userId').put(ManageAccount);

export default userRouter;