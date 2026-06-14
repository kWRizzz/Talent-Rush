const jwt= require('jsonwebtoken')


const generateToken= async (userId,userEmail) => {
    try {
        const token= jwt.sign({
            userId,
            userEmail
        },process.env.JWT_SECRET)
        return token
    } catch (error) {
        console.log(`some Error generated While Genarating the token ${error}`);
         return res.status(401).json({
            message:"Unautherised"
        })
    }
}


module.exports=generateToken