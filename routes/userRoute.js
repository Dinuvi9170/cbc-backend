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
import { requireAdmin, requireAuth } from '../controllers/middlewares/Authmiddleware.js';

const userRouter = express.Router();

userRouter.route('/').post(createUser).get(requireAuth, requireAdmin,getAllusers);
userRouter.post('/login',loginUser);
userRouter.post('/login/google',loginWithGoogle);
userRouter.post('/sendOTP',sendOTP);
userRouter.post('/reset_password',ResetPassword);
userRouter.route('/:userId').get(requireAuth,getUserbyId).put(requireAuth,updateProfile);
userRouter.route('/manage/:userId').put(requireAuth, requireAdmin,ManageAccount);

export default userRouter;