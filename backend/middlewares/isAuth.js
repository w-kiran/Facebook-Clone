import jwt from "jsonwebtoken"

const isAuth = async (req,res,next)=>{
    try {
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({
                message:"User not authenticated",
                success: false
            })
        }

        const verify = await jwt.verify(token,process.env.JWT_SECRET)
        if(!verify){
            return res.status(401).json({
                message:"Invalid",
                success: false
            })
        }
        req.id=verify.userId;
        next()
    } catch (error) {
        console.log(error);
    }
}

export default isAuth