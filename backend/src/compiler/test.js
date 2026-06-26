const {
    generateFile
}=require("./generateFile")
const execute= require("./executeJS")


const start= async () => {
    try {
        const filePath= await generateFile(
            "js",
            `console.log("hello")`
        )
        console.log(" file-->"  + filePath);

        const output= await execute(filePath)
        console.log("Output : ", output);
        
    } catch (error) {
        console.log(error)
    }
}

start()