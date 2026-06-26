const fs= require('fs')

const deleteFile= async (
    filePath
) => {
    try {
        
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath)
        }

    } catch (error) {
        console.log(error);
    }
}

module.exports=deleteFile