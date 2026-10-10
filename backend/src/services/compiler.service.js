const { generateFile } = require("../compiler/generateFile");
const deleteFile = require("../compiler/deleteFile");
const executeCode = require('../compiler/executeJS');
const vm = require('vm');

/**
 * Standard code execution
 */
const runCode = async (language, code) => {
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
 * Runs code against structured test cases.
 * Handles JavaScript functions via VM sandbox, comparing outputs against expected outputs.
 */
const runTestCases = async ({ language = "javascript", code = "", testCases = [] }) => {
    if (!testCases || testCases.length === 0) {
        const directRun = await runCode(language, code);
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