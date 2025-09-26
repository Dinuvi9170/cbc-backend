import express from 'express';
import { createUser,loginUser } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.route('/').post(createUser);
userRouter.post('/login',loginUser);
//.get();
//userRouter.route('/:id').post().get().delete().put();

export default userRouter;