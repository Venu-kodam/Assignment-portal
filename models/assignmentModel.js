import mongoose from 'mongoose'

const assignmentSchema = new mongoose.Schema({
    userId:{type:String,required:true},
    task:{type:String,required:true},
    admin:{type:String,required:true},
    status:{type:String,enum:['Pending','Accepted','Rejected'],default:'Pending'},
    date:{type:Date,default:Date.now},
})

const assignmentModel = mongoose.models.assignment || mongoose.model('assignment',assignmentSchema)
export default assignmentModel