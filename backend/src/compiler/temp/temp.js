const generateFile= require("../generateFile")

(async () => {
    const filePath= await generateFile(
        "js",
        `console.log("hello randi")`
    )

    console.log(filePath)
})()

