const fs= require('fs')
const path= require("path")
const crypto= require("crypto")


const dirPath=path.join(__dirname,"temp")

if(!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath,{
        recursive:true
    })
}


const generateFile = async (
    language,
    code
) => {
    const jobId= crypto.randomBytes(16).toString("hex")

    const fileName=`${jobId}.${language}`
    const filePath=path.join(
        dirPath,
        fileName
    )

    fs.writeFileSync(
        filePath,
        code
    )

    
    return filePath;

}

module.exports= {
    generateFile
}