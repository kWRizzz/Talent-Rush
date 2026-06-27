const {
    generateFile
} = require("../compiler/generateFile")
const execute = require('../compiler/executeJS')
const deleteFile= require('../compiler/deleteFile')

const compilerServices= require('../services/compiler.service')

const executeCode = async (
    req,
    res
) => {
    try {
        const {
            language,
            code
        } = req.body

        if (!language || !code) {
            return res.status(400).json({
                message: "no lang code found"
            })
        }

        const output= await compilerServices(language,code)
        return res.status(200).json({

            success: true,

            output

        });

    } catch (error) {
        console.log(`error in making execute yur question ${error}`);
        return res.status(500).json({
            message: `error asdasin execution ${error}`,
            success: false
        })
    }
}



module.exports={
    executeCode
}

