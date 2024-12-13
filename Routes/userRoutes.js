import express from 'express'
import { getAllAdmins, login, register, uploadAssignment } from '../controllers/userController.js'
import authMiddleware from '../middlewares/auth.js'

const userRouter = express.Router()

userRouter.post('/register',register)
userRouter.post('/login',login)
userRouter.post('/upload',authMiddleware('User'),uploadAssignment)
userRouter.get('/admins',authMiddleware('User'),getAllAdmins)
export default userRouter