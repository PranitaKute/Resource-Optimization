import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData,updateStudentProfile } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth,getUserData);
userRouter.post('/update-profile', userAuth, updateStudentProfile);


export default userRouter;
