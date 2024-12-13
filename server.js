import express from 'express'
import 'dotenv/config'
import connectDB from './config/DB.js'
import userRouter from './Routes/userRoutes.js'
import adminRouter from './Routes/adminRoutes.js'

const app  = express()
const PORT = process.env.PORT || 4000

app.use(express.json())
connectDB()

//api endpoints

app.use('/user',userRouter)
app.use('/admin',adminRouter)
app.get('/',(req,res)=>{
    res.send('API working')
})
app.listen(PORT,console.log(`Server running on port http://localhost:${PORT}`))