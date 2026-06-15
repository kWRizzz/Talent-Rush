const bcryptjs = require('bcryptjs')


const passwordHashing = async (password) => {
    try {
        const salt = bcryptjs.genSaltSync(10);
        const hashedPassword = bcryptjs.hashSync(password, salt);

        return hashedPassword
    } catch (error) {
        console.log(`some error in hashing the passwor ${error}`);
        throw new Error("Token Generation Failed")
    }
}


module.exports = passwordHashing



