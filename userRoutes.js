import express from 'express';
import userAuth from '../middelwares/authMiddleware.js';
import { updateUserController } from '../controllers/userController.js';

//router object
const router = express.Router();

//route
//get user


//update user
router.put('/update-user', userAuth, updateUserController);

export default router;