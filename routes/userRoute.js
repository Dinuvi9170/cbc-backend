import express from 'express';
import { createUser,loginUser, loginWithGoogle } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.route('/').post(createUser);
userRouter.post('/login',loginUser);
userRouter.post('/login/google',loginWithGoogle);

export default userRouter;