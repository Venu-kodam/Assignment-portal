import userModel from "../models/userModel.js"
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import assignmentModel from "../models/assignmentModel.js"
import adminModel from "../models/adminModel.js"

const register = async(req,res)=>{
    try {
        const { username, email, password } = req.body

        //checking if the user already exists
        const exists = await userModel.findOne({ email })
        if (exists) {
            return res.json({ success: false, message: "User already exists" })
        }

        //validating email format and password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please enter valid email' })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        //hasing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new userModel({
            username, 
            email, 
            password:hashedPassword
        })

        const user = await newUser.save()
        const token = jwt.sign({id:user._id,username:user.username,role:'User'},process.env.JWT_SECRET)
        res.json({success:true,message:"User Registered Successfully",token})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}
const login = async(req,res)=>{
    try {
        const{email,password} = req.body
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:'User does not exist'})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(isMatch){
            const token = jwt.sign({id:user._id,username:user.username,role:'User'},process.env.JWT_SECRET)
            return res.json({success:true,token})
        }
        else{
            return res.json({success:false,message:"Invalid credentials"})
        }
    } catch (error) {
        console.log(error);
        return res.json({success:false,message:error.message})
    }
}

const uploadAssignment = async(req,res)=>{
    try {
        const{task,admin} = req.body
        console.log("Request user",req.user);
        //check if the admin with the given name exists
        const adminData = await adminModel.findOne({username:admin})
        if(!adminData){
            return  res.json({success:false,message:"Admin doesn't exist"})
        }

        //save assignment
        const assignment = new assignmentModel({
            userId:req.user.username,  //save users name
            task,
            admin:adminData.username   //save admins name
        })
        await assignment.save()
        return res.json({success:true,message:"Assignment Uploaded",assignment})
    } catch (error) {
        console.log(error);
        return res.json({success:false,message:error.message})
    }
}

const getAllAdmins = async(req,res)=>{
    try {
        const admins = await adminModel.find({},'username')
        return res.json(admins)
    } catch (error) {
        console.log(error);
        return res.json({success:false,message:error.message})
    }
}
export {register,login,uploadAssignment,getAllAdmins}