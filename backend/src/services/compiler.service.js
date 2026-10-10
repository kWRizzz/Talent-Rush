const { generateFile } = require("../compiler/generateFile");
const deleteFile = require("../compiler/deleteFile");
const executeCode = require('../compiler/executeJS');
const { executeJava, buildJavaRunner, sanitizeJavaError } = require('../compiler/executeJava');
const vm = require('vm');

/**
 * Standard code execution
 */
const runCode = async (language, code) => {
    const lang = (language || "javascript").toLowerCase();

    // Java direct execution
    if (lang === "java") {
        let filePath = null;
        try {
            let executableCode = code || "";
            // If code has no main method, provide a clean runner message
            if (!executableCode.includes("static void main")) {
                const sanitized = executableCode.replace(/\bpublic\s+(class|interface|enum|record)\b/g, '$1');
                executableCode = `class MainRunner {
    public static void main(String[] args) {
        System.out.println("Java class compiled successfully. To run your code, define 'public static void main(String[] args)' or click 'Run Code' with test cases.");
    }
}
${sanitized}`;
            }

            filePath = await generateFile("java", executableCode);
            const { stdout, stderr } = await executeJava(filePath);
            deleteFile(filePath);
            return {
                success: true,
                output: stdout || stderr || "Execution completed with no output."
            };
        } catch (error) {
            if (filePath) deleteFile(filePath);
            return {
                success: false,
                output: sanitizeJavaError(error.message || error.toString() || "Execution failed")
            };
        }
    }

    try {
        const filePath = await generateFile(language, code);
        const output = await executeCode(filePath);
        deleteFile(filePath);
        return {
            success: true,
            output
        };
    } catch (error) {
        return {
            success: false,
            output: error.message || error.toString() || "Execution failed"
        };
    }
};

/**
 * Runs Java code against test cases using reflection-based test harness
 */
const runJavaTestCases = async ({ code = "", testCases = [] }) => {
    let filePath = null;
    try {
        const fullSource = buildJavaRunner(code, testCases);
        filePath = await generateFile("java", fullSource);

        const { stdout, stderr } = await executeJava(filePath);
        deleteFile(filePath);
        filePath = null;

        const match = stdout.match(/===JAVA_RUNNER_RESULTS_START===([\s\S]*?)===JAVA_RUNNER_RESULTS_END===/);
        if (!match) {
            const errorOutput = sanitizeJavaError(stderr || stdout || "Execution failed to produce test results");
            return {
                success: false,
                allPassed: false,
                passedCount: 0,
                totalCount: testCases.length,
                results: testCases.map((tc, idx) => ({
                    index: idx + 1,
                    input: tc.input,
                    expected: tc.expectedOutput || "",
                    actual: "Error: " + errorOutput,
                    passed: false,
                    error: errorOutput
                })),
                stdout: errorOutput
            };
        }

        const results = JSON.parse(match[1].trim());
        const allPassed = results.length > 0 && results.every(r => r.passed);
        const passedCount = results.filter(r => r.passed).length;
        const combinedStdout = results.map(r => r.stdout ? `[Test ${r.index}] ${r.stdout}` : null).filter(Boolean).join('\n');

        return {
            success: true,
            allPassed,
            passedCount,
            totalCount: results.length,
            results,
            stdout: combinedStdout
        };
    } catch (err) {
        if (filePath) {
            deleteFile(filePath);
        }
        const errorOutput = sanitizeJavaError(err.message || err.toString());
        return {
            success: false,
            allPassed: false,
            passedCount: 0,
            totalCount: testCases.length,
            results: testCases.map((tc, idx) => ({
                index: idx + 1,
                input: tc.input,
                expected: tc.expectedOutput || "",
                actual: "Compilation / Runtime Error:\n" + errorOutput,
                passed: false,
                error: errorOutput
            })),
            stdout: errorOutput
        };
    }
};

/**
 * Runs code against structured test cases.
 * Handles JavaScript functions via VM sandbox, and Java solutions via reflection harness.
 */
const runTestCases = async ({ language = "javascript", code = "", testCases = [] }) => {
    const lang = (language || "javascript").toLowerCase();

    if (!testCases || testCases.length === 0) {
        const directRun = await runCode(lang, code);
        return {
            success: directRun.success,
            allPassed: directRun.success,
            passedCount: directRun.success ? 1 : 0,
            totalCount: 1,
            results: [{
                index: 1,
                input: "Default Execution",
                expected: "-",
                actual: directRun.output,
                passed: directRun.success
            }],
            stdout: directRun.output
        };
    }

    if (lang === "java") {
        return await runJavaTestCases({ code, testCases });
    }

    if (language.toLowerCase() === "javascript" || language.toLowerCase() === "js") {
        const results = [];
        let allPassed = true;
        let combinedLogs = [];

        for (let i = 0; i < testCases.length; i++) {
            const tc = testCases[i];
            const startTime = Date.now();
            let capturedLogs = [];
            const context = {
                console: {
                    log: (...args) => capturedLogs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
                    error: (...args) => capturedLogs.push('[ERROR] ' + args.join(' ')),
                    warn: (...args) => capturedLogs.push('[WARN] ' + args.join(' '))
                },
                Map,
                Set,
                Math,
                Array,
                Object,
                String,
                Number,
                Boolean,
                Date,
                parseInt,
                parseFloat,
                isNaN,
                isFinite
            };
            vm.createContext(context);

            try {
                // Execute user's code definition
                vm.runInContext(code, context, { timeout: 4000 });

                // Find candidate solution function
                const fnNames = Object.keys(context).filter(k => 
                    !['console', 'Map', 'Set', 'Math', 'Array', 'Object', 'String', 'Number', 'Boolean', 'Date', 'parseInt', 'parseFloat', 'isNaN', 'isFinite'].includes(k) 
                    && typeof context[k] === 'function'
                );

                if (fnNames.length === 0) {
                    // If no function defined, fallback to raw console logs or return
                    const logOut = capturedLogs.join('\n');
                    results.push({
                        index: i + 1,
                        input: tc.input,
                        expected: tc.expectedOutput || "",
                        actual: logOut || "No function found in code",
                        passed: false,
                        executionTimeMs: Date.now() - startTime,
                        error: "No solution function exported or declared"
                    });
                    allPassed = false;
                    continue;
                }

                // Pick the first declared function (or last declared)
                const mainFn = context[fnNames[0]];

                // Parse input arguments
                let args = [];
                const rawInput = tc.input || "";
                const lines = rawInput.split('\n').map(l => l.trim()).filter(Boolean);

                args = lines.map(line => {
                    let cleaned = line;
                    // Handle "nums = [2,7,11,15]" format
                    const eqIdx = cleaned.indexOf('=');
                    if (eqIdx !== -1 && !cleaned.startsWith('{') && !cleaned.startsWith('[')) {
                        cleaned = cleaned.substring(eqIdx + 1).trim();
                    }
                    try {
                        return JSON.parse(cleaned);
                    } catch {
                        // Return raw string if not JSON
                        return cleaned;
                    }
                });

                const rawResult = mainFn(...args);
                const actualStr = rawResult !== undefined ? JSON.stringify(rawResult) : "undefined";
                const expectedClean = (tc.expectedOutput || "").trim();

                let passed = false;
                try {
                    const expectedParsed = JSON.parse(expectedClean);
                    passed = JSON.stringify(rawResult) === JSON.stringify(expectedParsed);
                } catch {
                    passed = actualStr === expectedClean || String(rawResult) === expectedClean;
                }

                if (!passed) allPassed = false;
                if (capturedLogs.length > 0) combinedLogs.push(`[Test ${i + 1}] ${capturedLogs.join(' ')}`);

                results.push({
                    index: i + 1,
                    input: tc.input,
                    expected: tc.expectedOutput || "",
                    actual: actualStr,
                    passed,
                    executionTimeMs: Date.now() - startTime,
                    stdout: capturedLogs.join('\n')
                });

            } catch (err) {
                allPassed = false;
                results.push({
                    index: i + 1,
                    input: tc.input,
                    expected: tc.expectedOutput || "",
                    actual: "Runtime Error: " + err.message,
                    passed: false,
                    executionTimeMs: Date.now() - startTime,
                    error: err.message
                });
            }
        }

        const passedCount = results.filter(r => r.passed).length;
        return {
            success: true,
            allPassed,
            passedCount,
            totalCount: results.length,
            results,
            stdout: combinedLogs.join('\n')
        };
    }

    // Fallback for non-JS execution: run file directly
    const directResult = await runCode(language, code);
    return {
        success: directResult.success,
        allPassed: directResult.success,
        passedCount: directResult.success ? testCases.length : 0,
        totalCount: testCases.length,
        results: testCases.map((tc, idx) => ({
            index: idx + 1,
            input: tc.input,
            expected: tc.expectedOutput,
            actual: directResult.output,
            passed: directResult.success
        })),
        stdout: directResult.output
    };
};

module.exports = {
    runCode,
    runTestCases
};