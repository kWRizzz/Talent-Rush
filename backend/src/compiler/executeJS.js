const{
    exec
} = require("child_process")


const execute= async (
    filePath
) => {
    return new Promise((
        resolve,
        error
    )=>{
        exec(
            `node ${filePath}`,
            (error,stdout,stderr)=>{
                if(error){
                    return reject(error)
                }
                if(stderr){
                    return reject(stderr)
                }

                return resolve(stdout);
            }
        )
    })
}

module.exports=execute