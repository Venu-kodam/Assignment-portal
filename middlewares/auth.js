import jwt from 'jsonwebtoken'

const authMiddleware = (role) => {
    return (req, res, next) => {
        const { token } = req.headers
        if (!token) {
            return res.json({ success: false, message: "Access Denied" })
        }
        try {
            const token_decode = jwt.verify(token, process.env.JWT_SECRET)
            if(token_decode.role !==role){
                return res.status(403).json({message:'Forbidden'})
            }
            req.user = token_decode
            next()
        } catch (error) {
            console.log(error);
            res.json({ success: false, message: error.message })
        }
    }

}
export default authMiddleware