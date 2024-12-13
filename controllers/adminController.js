import adminModel from "../models/adminModel.js"
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import assignmentModel from "../models/assignmentModel.js"

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body

        //checking if the user already exists
        const exists = await adminModel.findOne({ email })
        if (exists) {
            return res.json({ success: false, message: "Admin already exists" })
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

        const newAdmin = new adminModel({
            username,
            email,
            password: hashedPassword
        })

        const admin = await newAdmin.save()
        const token = jwt.sign({ id: admin._id,username:admin.username, role: 'Admin' }, process.env.JWT_SECRET)
        res.json({ success: true, message: "Admin Registered Successfully", token })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const admin = await adminModel.findOne({ email })
        if (!admin) {
            return res.json({ success: false, message: 'Admin does not exist' })
        }
        const isMatch = await bcrypt.compare(password, admin.password)
        if (isMatch) {
            const token = jwt.sign({ id: admin._id,username:admin.username, role: 'Admin' }, process.env.JWT_SECRET)
            return res.json({ success: true, token })
        }
        else {
            return res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })
    }
}

const getAssignments = async (req, res) => {
    try {
        //get the assignments
        const assignments = await assignmentModel.find({ admin: req.user.username })
        res.json({ success: true, assignments })
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })
    }
}

const updateAssignmentStatus = async (req, res) => {
    try {
        const { id } = req.params 
        const { status } = req.body  //Status accepted or rejected

        //validate status
        if (!['Accepted', 'Rejected'].includes(status)){
            return res.json({ success: false, message: "Invalid Status, Use 'Accepted' or 'Rejected.' " })
        }

        //update the assignment status
        const assignment = await assignmentModel.findByIdAndUpdate(id,{status})

        //check if the assignment exists
        if(!assignment){
            return res.json({ success: false, message: "Assignment not found." })
        }
        return res.json({ success: true, message: `Assignment ${status}`,assignment })
           
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message })
    }
}
export { register, login,getAssignments,updateAssignmentStatus }