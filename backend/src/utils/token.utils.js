const jwt = require('jsonwebtoken')


const generateToken = async (userId, userEmail) => {
    try {
        const token = jwt.sign({
            userId,
            userEmail,
            role
        }, process.env.JWT_SECRET, { expiresIn: "7d" })
        return token
    } catch (error) {
        console.log(`some Error generated While Genarating the token ${error}`);
        throw new Error(
            "Token Generation Failed"
        )
    }
}


module.exports = generateToken