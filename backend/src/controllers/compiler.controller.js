const { runCode, runTestCases } = require('../services/compiler.service');

const executeCode = async (req, res) => {
    try {
        const { language, code } = req.body;

        if (!language || !code) {
            return res.status(400).json({
                success: false,
                message: "Language and code are required"
            });
        }

        const output = await runCode(language, code);
        return res.status(200).json({
            success: true,
            output
        });

    } catch (error) {
        console.error(`Error executing code:`, error);
        return res.status(500).json({
            success: false,
            message: `Execution failed: ${error.message}`
        });
    }
};

const executeTestCases = async (req, res) => {
    try {
        const { language = "javascript", code, testCases } = req.body;

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Code is required"
            });
        }

        const result = await runTestCases({
            language,
            code,
            testCases: testCases || []
        });

        return res.status(200).json({
            success: true,
            result
        });
    } catch (error) {
        console.error("Error executing test cases:", error);
        return res.status(500).json({
            success: false,
            message: `Test execution failed: ${error.message}`
        });
    }
};

module.exports = {
    executeCode,
    executeTestCases
};
