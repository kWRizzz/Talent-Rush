const jwt= require('jsonwebtoken')
const tokenModel=require('../models/tokens.model')

const authMiddleware= async (req,res,next) => {
    try {
        const token=req.cookies.token;
        
        if(!token) return res.status(400).json({
            message:"No Token Found"
        })

        const isExist= await tokenModel.findOne({token})

        if(isExist) return res.status(400).json({
            message:"Invalid Token"
        })

        const decoded= jwt.verify(token,process.env.JWT_SECRET)

        req.user= decoded
        next()

    } catch (error) {
        console.log(`some Error In ${error}`);
        return res.status(401).json({
            message:"Unautherised"
        })
    }
}


module.exports=authMiddleware