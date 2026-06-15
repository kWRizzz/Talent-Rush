
const roleMiddleWare= (...role)=>{
    return (req,res,next)=>{
        if(!req.includes(req.user.role)){
            return res.status(403).json({
                message:"Forbidden"
            })
        }
        next();
    }
}


module.exports=roleMiddleware