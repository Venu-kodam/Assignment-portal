import express from 'express'
import authMiddleware from '../middlewares/auth.js'
import { register,login, getAssignments, updateAssignmentStatus } from '../controllers/adminController.js'

const adminRouter = express.Router()

adminRouter.post('/register',register)
adminRouter.post('/login',login)
adminRouter.get('/assignments',authMiddleware('Admin'),getAssignments)
adminRouter.post('/assignments/:id/accept',authMiddleware('Admin'),async(req,res)=>{
    req.body.status = "Accepted";
    updateAssignmentStatus(req,res)
})
adminRouter.post('/assignments/:id/reject',authMiddleware('Admin'),async(req,res)=>{
    req.body.status = "Rejected";
    updateAssignmentStatus(req,res)
})
export default adminRouter