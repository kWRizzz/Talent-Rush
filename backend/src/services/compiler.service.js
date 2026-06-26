const {
    generateFile
}=require("../compiler/generateFile")
const deleteFile= require("../compiler/deleteFile")
const executeCode=require('../compiler/executeJS')


const runCode= async (
    language,
    code
) => {
    let filePath=""
    try {
        const filePath= await generateFile(
            language,
            code
        )   
        const output = await executeCode(filePath)

        deleteFile(filePath)
        return {
            success:true,
            output
        }
    } catch(error){
        console.log(error);
        
    }
}

module.exports= runCode