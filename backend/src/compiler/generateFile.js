const fs= require('fs')
const path= require("path")
const crypto= require("crypto")


const dirPath=path.join(__dirname,"temp")

if(!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath,{
        recursive:true
    })
}


const EXTENSION_MAP = {
    javascript: "js",
    js: "js",
    java: "java",
    python: "py",
    py: "py",
    cpp: "cpp",
    "c++": "cpp",
    c: "c"
};

const generateFile = async (
    language,
    code
) => {
    const jobId = crypto.randomBytes(16).toString("hex");
    const langKey = (language || "").toLowerCase();
    const ext = EXTENSION_MAP[langKey] || langKey || "txt";

    const fileName = `${jobId}.${ext}`;
    const filePath = path.join(
        dirPath,
        fileName
    );

    let finalCode = code;
    // For Java single-file execution, classes cannot be public unless matching file name
    if (ext === "java") {
        finalCode = finalCode.replace(/\bpublic\s+(class|interface|enum|record)\b/g, '$1');
    }

    fs.writeFileSync(
        filePath,
        finalCode,
        'utf8'
    );

    return filePath;
};

module.exports = {
    generateFile
};