const { exec } = require('child_process');

/**
 * Strips internal file paths from Java compiler/runtime errors to keep errors clean.
 */
const sanitizeJavaError = (err) => {
    return (err || '')
        .replace(/[A-Za-z]:\\[^:\n\r]+temp\\[a-f0-9_]+\.java:?/gi, 'Line ')
        .replace(/^[ \t]*error:[ \t]*/gim, '')
        .trim();
};

/**
 * Executes a single-file Java source program.
 */
const executeJava = async (filePath, options = {}) => {
    const timeout = options.timeout || 10000;
    return new Promise((resolve, reject) => {
        exec(
            `java "${filePath}"`,
            { timeout, maxBuffer: 1024 * 1024 * 5 },
            (error, stdout, stderr) => {
                if (error) {
                    if (error.killed || error.signal === 'SIGTERM') {
                        return reject(new Error(`Time Limit Exceeded (${timeout}ms)`));
                    }
                    const errMsg = (stderr || stdout || error.message || "").toString();
                    return reject(new Error(errMsg));
                }
                if (stderr && !stdout) {
                    return reject(new Error(stderr.toString()));
                }
                return resolve({ stdout: stdout.toString(), stderr: stderr ? stderr.toString() : "" });
            }
        );
    });
};

/**
 * Generates a complete Java source file with MainRunner as the first class to run
 * LeetCode solutions against test cases using reflection.
 */
const buildJavaRunner = (userCode, testCases = []) => {
    // Single-file Java source cannot declare public classes unless matching file name
    const sanitizedUserCode = (userCode || "").replace(/\bpublic\s+(class|interface|enum|record)\b/g, '$1');
    const hasListNode = /\bclass\s+ListNode\b/.test(sanitizedUserCode);
    const hasTreeNode = /\bclass\s+TreeNode\b/.test(sanitizedUserCode);

    const testCasesLiteral = testCases.map(tc => 
        `        { ${JSON.stringify(tc.input || "")}, ${JSON.stringify(tc.expectedOutput || "")} }`
    ).join(',\n');

    return `import java.io.*;
import java.lang.reflect.*;
import java.util.*;

class MainRunner {
    private static final String[][] TEST_CASES = new String[][] {
${testCasesLiteral}
    };

    public static void main(String[] args) {
        PrintStream origOut = System.out;
        PrintStream origErr = System.err;

        try {
            Solution sol = new Solution();
            Method targetMethod = null;
            for (Method m : Solution.class.getDeclaredMethods()) {
                if (Modifier.isPublic(m.getModifiers()) && !m.getName().equals("main")) {
                    targetMethod = m;
                    break;
                }
            }
            if (targetMethod == null) {
                origOut.println("===JAVA_RUNNER_RESULTS_START===");
                origOut.println("[]");
                origOut.println("===JAVA_RUNNER_RESULTS_END===");
                origErr.println("Error: No public solution method found in class Solution");
                return;
            }

            Class<?>[] pTypes = targetMethod.getParameterTypes();
            StringBuilder json = new StringBuilder("[\\n");

            for (int i = 0; i < TEST_CASES.length; i++) {
                String rawInput = TEST_CASES[i][0];
                String expected = TEST_CASES[i][1];
                List<String> paramTokens = splitInput(rawInput, pTypes.length);

                Object[] parsedArgs = new Object[pTypes.length];
                for (int p = 0; p < pTypes.length; p++) {
                    String token = p < paramTokens.size() ? paramTokens.get(p) : "";
                    parsedArgs[p] = parseParam(token, pTypes[p]);
                }

                ByteArrayOutputStream cap = new ByteArrayOutputStream();
                System.setOut(new PrintStream(cap));

                long t0 = System.currentTimeMillis();
                String actual = "";
                String error = null;
                boolean passed = false;

                try {
                    Object res = targetMethod.invoke(sol, parsedArgs);
                    if (targetMethod.getReturnType() == void.class) {
                        res = parsedArgs.length > 0 ? parsedArgs[0] : "void";
                    }
                    actual = formatOutput(res);
                    passed = compareResult(actual, expected);
                } catch (InvocationTargetException ite) {
                    Throwable cause = ite.getCause() != null ? ite.getCause() : ite;
                    error = cause.getClass().getSimpleName() + ": " + cause.getMessage();
                    actual = "Runtime Error: " + error;
                } catch (Throwable t) {
                    error = t.getClass().getSimpleName() + ": " + t.getMessage();
                    actual = "Error: " + error;
                } finally {
                    System.setOut(origOut);
                }

                long elapsed = System.currentTimeMillis() - t0;
                String userStdout = cap.toString().trim();

                if (i > 0) json.append(",\\n");
                json.append("  {");
                json.append("\\"index\\":").append(i + 1).append(",");
                json.append("\\"input\\":\\"").append(escapeJson(rawInput)).append("\\",");
                json.append("\\"expected\\":\\"").append(escapeJson(expected)).append("\\",");
                json.append("\\"actual\\":\\"").append(escapeJson(actual)).append("\\",");
                json.append("\\"passed\\":").append(passed).append(",");
                json.append("\\"executionTimeMs\\":").append(elapsed).append(",");
                json.append("\\"stdout\\":\\"").append(escapeJson(userStdout)).append("\\",");
                json.append("\\"error\\":").append(error == null ? "null" : "\\"" + escapeJson(error) + "\\"");
                json.append("}");
            }

            json.append("\\n]");

            origOut.println("===JAVA_RUNNER_RESULTS_START===");
            origOut.println(json.toString());
            origOut.println("===JAVA_RUNNER_RESULTS_END===");

        } catch (Throwable t) {
            System.setOut(origOut);
            origErr.println("Runner Error: " + t.getMessage());
            t.printStackTrace(origErr);
        }
    }

    private static boolean compareResult(String actual, String expected) {
        String a = actual.replaceAll("\\\\s+", "").toLowerCase();
        String e = expected.replaceAll("\\\\s+", "").toLowerCase();
        if (a.equals(e)) return true;

        if (a.startsWith("[") && a.endsWith("]") && e.startsWith("[") && e.endsWith("]")) {
            String[] aParts = a.substring(1, a.length() - 1).split(",");
            String[] eParts = e.substring(1, e.length() - 1).split(",");
            if (aParts.length == eParts.length) {
                Arrays.sort(aParts);
                Arrays.sort(eParts);
                return Arrays.equals(aParts, eParts);
            }
        }
        return false;
    }

    private static List<String> splitInput(String input, int expectedParams) {
        String[] lines = input.split("\\r?\\n");
        List<String> valid = new ArrayList<>();
        for (String l : lines) {
            String trimmed = l.trim();
            if (!trimmed.isEmpty()) valid.add(trimmed);
        }
        if (valid.size() >= expectedParams && expectedParams > 1) return valid;
        if (valid.size() == 1 && expectedParams > 1) {
            List<String> parts = new ArrayList<>();
            StringBuilder sb = new StringBuilder();
            int depth = 0;
            boolean inQuote = false;
            String single = valid.get(0);
            for (int i = 0; i < single.length(); i++) {
                char c = single.charAt(i);
                if (c == '\"') inQuote = !inQuote;
                else if (!inQuote && (c == '[' || c == '{' || c == '(')) depth++;
                else if (!inQuote && (c == ']' || c == '}' || c == ')')) depth--;
                else if (!inQuote && depth == 0 && c == ',') {
                    parts.add(sb.toString().trim());
                    sb = new StringBuilder();
                    continue;
                }
                sb.append(c);
            }
            if (sb.length() > 0) parts.add(sb.toString().trim());
            return parts;
        }
        return valid;
    }

    private static Object parseParam(String raw, Class<?> type) {
        String s = raw.trim();
        if (s.contains("=") && !s.startsWith("[") && !s.startsWith("{")) {
            s = s.substring(s.indexOf('=') + 1).trim();
        }
        if (s.startsWith("\\"") && s.endsWith("\\"") && s.length() >= 2) {
            s = s.substring(1, s.length() - 1);
        }

        if (type == int.class || type == Integer.class) return Integer.parseInt(s.isEmpty() ? "0" : s);
        if (type == long.class || type == Long.class) return Long.parseLong(s.isEmpty() ? "0" : s);
        if (type == double.class || type == Double.class) return Double.parseDouble(s.isEmpty() ? "0" : s);
        if (type == boolean.class || type == Boolean.class) return Boolean.parseBoolean(s.toLowerCase());
        if (type == String.class) return s;
        if (type == char.class || type == Character.class) return s.length() > 0 ? s.charAt(0) : ' ';

        if (type == int[].class) {
            if (s.startsWith("[") && s.endsWith("]")) s = s.substring(1, s.length() - 1).trim();
            if (s.isEmpty()) return new int[0];
            String[] parts = s.split(",");
            int[] arr = new int[parts.length];
            for (int i = 0; i < parts.length; i++) arr[i] = Integer.parseInt(parts[i].trim());
            return arr;
        }

        if (type == int[][].class) {
            if (s.startsWith("[") && s.endsWith("]")) s = s.substring(1, s.length() - 1).trim();
            if (s.isEmpty()) return new int[0][0];
            List<int[]> rows = new ArrayList<>();
            int start = -1;
            for (int i = 0; i < s.length(); i++) {
                if (s.charAt(i) == '[') start = i;
                else if (s.charAt(i) == ']' && start != -1) {
                    String rowStr = s.substring(start + 1, i).trim();
                    if (rowStr.isEmpty()) {
                        rows.add(new int[0]);
                    } else {
                        String[] rparts = rowStr.split(",");
                        int[] rowArr = new int[rparts.length];
                        for (int r = 0; r < rparts.length; r++) rowArr[r] = Integer.parseInt(rparts[r].trim());
                        rows.add(rowArr);
                    }
                    start = -1;
                }
            }
            return rows.toArray(new int[0][]);
        }

        if (type == String[].class) {
            if (s.startsWith("[") && s.endsWith("]")) s = s.substring(1, s.length() - 1).trim();
            if (s.isEmpty()) return new String[0];
            String[] parts = s.split(",");
            String[] arr = new String[parts.length];
            for (int i = 0; i < parts.length; i++) {
                String p = parts[i].trim();
                if (p.startsWith("\\"") && p.endsWith("\\"")) p = p.substring(1, p.length() - 1);
                arr[i] = p;
            }
            return arr;
        }

        if (List.class.isAssignableFrom(type)) {
            if (s.startsWith("[") && s.endsWith("]")) s = s.substring(1, s.length() - 1).trim();
            if (s.isEmpty()) return new ArrayList<>();
            String[] parts = s.split(",");
            List<Object> list = new ArrayList<>();
            for (String p : parts) {
                String val = p.trim();
                try {
                    list.add(Integer.parseInt(val));
                } catch (Exception ex) {
                    if (val.startsWith("\\"") && val.endsWith("\\"")) val = val.substring(1, val.length() - 1);
                    list.add(val);
                }
            }
            return list;
        }

        if (type.getSimpleName().equals("ListNode")) {
            if (s.startsWith("[") && s.endsWith("]")) s = s.substring(1, s.length() - 1).trim();
            if (s.isEmpty()) return null;
            String[] parts = s.split(",");
            ListNode dummy = new ListNode(0);
            ListNode curr = dummy;
            for (String p : parts) {
                String numStr = p.trim();
                if (!numStr.isEmpty()) {
                    curr.next = new ListNode(Integer.parseInt(numStr));
                    curr = curr.next;
                }
            }
            return dummy.next;
        }

        return s;
    }

    private static String formatOutput(Object obj) {
        if (obj == null) return "null";
        if (obj instanceof int[]) return Arrays.toString((int[]) obj).replace(" ", "");
        if (obj instanceof long[]) return Arrays.toString((long[]) obj).replace(" ", "");
        if (obj instanceof double[]) return Arrays.toString((double[]) obj).replace(" ", "");
        if (obj instanceof boolean[]) return Arrays.toString((boolean[]) obj).replace(" ", "");
        if (obj instanceof Object[]) return Arrays.deepToString((Object[]) obj).replace(" ", "");
        if (obj instanceof Collection) return obj.toString().replace(" ", "");
        if (obj.getClass().getSimpleName().equals("ListNode")) {
            StringBuilder sb = new StringBuilder("[");
            try {
                Field valField = obj.getClass().getDeclaredField("val");
                Field nextField = obj.getClass().getDeclaredField("next");
                valField.setAccessible(true);
                nextField.setAccessible(true);
                Object curr = obj;
                while (curr != null) {
                    sb.append(valField.get(curr));
                    curr = nextField.get(curr);
                    if (curr != null) sb.append(",");
                }
            } catch (Exception ignored) {
                return obj.toString();
            }
            sb.append("]");
            return sb.toString();
        }
        return String.valueOf(obj);
    }

    private static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\\\", "\\\\\\\\")
                .replace("\\"", "\\\\\\\"")
                .replace("\\n", "\\\\n")
                .replace("\\r", "\\\\r")
                .replace("\\t", "\\\\t");
    }
}

${!hasListNode ? `class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}` : ''}

${!hasTreeNode ? `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}` : ''}

${sanitizedUserCode}
`;
};

module.exports = {
    executeJava,
    buildJavaRunner,
    sanitizeJavaError
};
