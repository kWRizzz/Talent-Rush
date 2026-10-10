/**
 * LeetCode Service
 * Fetches LeetCode problem details by problem number (e.g. 1 -> Two Sum)
 * Supports live LeetCode GraphQL API with a comprehensive curated fallback database.
 */

// Curated database of top interview LeetCode problems with actual test cases and starter codes
const CURATED_LEETCODE_PROBLEMS = {
    1: {
        leetcodeId: 1,
        title: "Two Sum",
        difficulty: "easy",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
        starterCode: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n    // Write your code here\n    \n}",
        starterCodes: {
            javascript: "function twoSum(nums, target) {\n    // Write your code here\n    \n}",
            python: "def twoSum(nums: list[int], target: int) -> list[int]:\n    # Write your code here\n    pass",
            cpp: "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};",
            java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}"
        },
        example: [
            {
                input: "nums = [2,7,11,15], target = 9",
                output: "[0,1]",
                explaination: "Because nums[0] + nums[1] == 9, we return [0, 1]."
            },
            {
                input: "nums = [3,2,4], target = 6",
                output: "[1,2]",
                explaination: "Because nums[1] + nums[2] == 6, we return [1, 2]."
            },
            {
                input: "nums = [3,3], target = 6",
                output: "[0,1]",
                explaination: "Because nums[0] + nums[1] == 6, we return [0, 1]."
            }
        ],
        testCases: [
            { input: "[2,7,11,15]\n9", expectedOutput: "[0,1]" },
            { input: "[3,2,4]\n6", expectedOutput: "[1,2]" },
            { input: "[3,3]\n6", expectedOutput: "[0,1]" }
        ],
        constraints: [
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9",
            "-10^9 <= target <= 10^9",
            "Only one valid answer exists."
        ],
        topicTags: ["Array", "Hash Table"]
    },
    2: {
        leetcodeId: 2,
        title: "Add Two Numbers",
        difficulty: "medium",
        description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
        starterCode: "function addTwoNumbers(l1, l2) {\n    // Write your solution here\n}",
        starterCodes: {
            javascript: "function addTwoNumbers(l1, l2) {\n    // Write your solution here\n}",
            python: "def addTwoNumbers(l1, l2):\n    # Write your solution here\n    pass",
            java: "/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode() {}\n *     ListNode(int val) { this.val = val; }\n *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n * }\n */\nclass Solution {\n    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n        \n    }\n}"
        },
        example: [
            {
                input: "l1 = [2,4,3], l2 = [5,6,4]",
                output: "[7,0,8]",
                explaination: "342 + 465 = 807."
            }
        ],
        testCases: [
            { input: "[2,4,3]\n[5,6,4]", expectedOutput: "[7,0,8]" },
            { input: "[0]\n[0]", expectedOutput: "[0]" }
        ],
        constraints: ["The number of nodes in each linked list is in the range [1, 100].", "0 <= Node.val <= 9"],
        topicTags: ["Linked List", "Math"]
    },
    9: {
        leetcodeId: 9,
        title: "Palindrome Number",
        difficulty: "easy",
        description: "Given an integer x, return true if x is a palindrome, and false otherwise.\n\nAn integer is a palindrome when it reads the same forward and backward.",
        starterCode: "function isPalindrome(x) {\n    // Write your code here\n}",
        starterCodes: {
            javascript: "function isPalindrome(x) {\n    // Write your code here\n}",
            python: "def isPalindrome(x: int) -> bool:\n    pass",
            java: "class Solution {\n    public boolean isPalindrome(int x) {\n        \n    }\n}"
        },
        example: [
            { input: "x = 121", output: "true", explaination: "121 reads as 121 from left to right and from right to left." },
            { input: "x = -121", output: "false", explaination: "From left to right, it reads -121. From right to left, it becomes 121-." },
            { input: "x = 10", output: "false", explaination: "Reads 01 from right to left." }
        ],
        testCases: [
            { input: "121", expectedOutput: "true" },
            { input: "-121", expectedOutput: "false" },
            { input: "10", expectedOutput: "false" }
        ],
        constraints: ["-2^31 <= x <= 2^31 - 1"],
        topicTags: ["Math"]
    },
    20: {
        leetcodeId: 20,
        title: "Valid Parentheses",
        difficulty: "easy",
        description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
        starterCode: "function isValid(s) {\n    // Write your code here\n}",
        starterCodes: {
            javascript: "function isValid(s) {\n    // Write your code here\n}",
            python: "def isValid(s: str) -> bool:\n    pass",
            java: "class Solution {\n    public boolean isValid(String s) {\n        \n    }\n}"
        },
        example: [
            { input: "s = '()'", output: "true", explaination: "The brackets match." },
            { input: "s = '()[]{}'", output: "true", explaination: "All brackets match." },
            { input: "s = '(]'", output: "false", explaination: "Closing bracket does not match open bracket." }
        ],
        testCases: [
            { input: "\"()\"", expectedOutput: "true" },
            { input: "\"()[]{}\"", expectedOutput: "true" },
            { input: "\"(]\"", expectedOutput: "false" },
            { input: "\"([])\"", expectedOutput: "true" }
        ],
        constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."],
        topicTags: ["String", "Stack"]
    },
    21: {
        leetcodeId: 21,
        title: "Merge Two Sorted Lists",
        difficulty: "easy",
        description: "You are given the heads of two sorted linked lists list1 and list2.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.",
        starterCode: "function mergeTwoLists(list1, list2) {\n    // Write your solution here\n}",
        starterCodes: {
            javascript: "function mergeTwoLists(list1, list2) {\n    // Write your solution here\n}",
            python: "def mergeTwoLists(list1, list2):\n    pass",
            java: "/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode() {}\n *     ListNode(int val) { this.val = val; }\n *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n * }\n */\nclass Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        \n    }\n}"
        },
        example: [
            { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]", explaination: "Merged in ascending order." },
            { input: "list1 = [], list2 = []", output: "[]", explaination: "Both are empty." }
        ],
        testCases: [
            { input: "[1,2,4]\n[1,3,4]", expectedOutput: "[1,1,2,3,4,4]" },
            { input: "[]\n[]", expectedOutput: "[]" }
        ],
        constraints: ["The number of nodes in both lists is in the range [0, 50].", "-100 <= Node.val <= 100"],
        topicTags: ["Linked List", "Recursion"]
    },
    53: {
        leetcodeId: 53,
        title: "Maximum Subarray",
        difficulty: "medium",
        description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.\n\nA subarray is a contiguous non-empty sequence of elements within an array.",
        starterCode: "function maxSubArray(nums) {\n    // Write your code here (Kadane's algorithm)\n}",
        starterCodes: {
            javascript: "function maxSubArray(nums) {\n    // Write your code here\n}",
            python: "def maxSubArray(nums: list[int]) -> int:\n    pass",
            java: "class Solution {\n    public int maxSubArray(int[] nums) {\n        \n    }\n}"
        },
        example: [
            { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explaination: "The subarray [4,-1,2,1] has the largest sum 6." },
            { input: "nums = [1]", output: "1", explaination: "The subarray [1] has the largest sum 1." },
            { input: "nums = [5,4,-1,7,8]", output: "23", explaination: "The subarray [5,4,-1,7,8] has the largest sum 23." }
        ],
        testCases: [
            { input: "[-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6" },
            { input: "[1]", expectedOutput: "1" },
            { input: "[5,4,-1,7,8]", expectedOutput: "23" }
        ],
        constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
        topicTags: ["Array", "Divide and Conquer", "Dynamic Programming"]
    },
    70: {
        leetcodeId: 70,
        title: "Climbing Stairs",
        difficulty: "easy",
        description: "You are climbing a staircase. It takes n steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
        starterCode: "function climbStairs(n) {\n    // Write your code here\n}",
        starterCodes: {
            javascript: "function climbStairs(n) {\n    // Write your code here\n}",
            python: "def climbStairs(n: int) -> int:\n    pass",
            java: "class Solution {\n    public int climbStairs(int n) {\n        \n    }\n}"
        },
        example: [
            { input: "n = 2", output: "2", explaination: "1. 1 step + 1 step\n2. 2 steps" },
            { input: "n = 3", output: "3", explaination: "1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step" }
        ],
        testCases: [
            { input: "2", expectedOutput: "2" },
            { input: "3", expectedOutput: "3" },
            { input: "5", expectedOutput: "8" }
        ],
        constraints: ["1 <= n <= 45"],
        topicTags: ["Math", "Dynamic Programming", "Memoization"]
    },
    121: {
        leetcodeId: 121,
        title: "Best Time to Buy and Sell Stock",
        difficulty: "easy",
        description: "You are given an array prices where prices[i] is the price of a given stock on the ith day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
        starterCode: "function maxProfit(prices) {\n    // Write your code here\n}",
        starterCodes: {
            javascript: "function maxProfit(prices) {\n    // Write your code here\n}",
            python: "def maxProfit(prices: list[int]) -> int:\n    pass",
            java: "class Solution {\n    public int maxProfit(int[] prices) {\n        \n    }\n}"
        },
        example: [
            { input: "prices = [7,1,5,3,6,4]", output: "5", explaination: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5." },
            { input: "prices = [7,6,4,3,1]", output: "0", explaination: "In this case, no transactions are done and max profit = 0." }
        ],
        testCases: [
            { input: "[7,1,5,3,6,4]", expectedOutput: "5" },
            { input: "[7,6,4,3,1]", expectedOutput: "0" }
        ],
        constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
        topicTags: ["Array", "Dynamic Programming"]
    },
    125: {
        leetcodeId: 125,
        title: "Valid Palindrome",
        difficulty: "easy",
        description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string s, return true if it is a palindrome, or false otherwise.",
        starterCode: "function isPalindrome(s) {\n    // Write your code here\n}",
        starterCodes: {
            javascript: "function isPalindrome(s) {\n    // Write your code here\n}",
            python: "def isPalindrome(s: str) -> bool:\n    pass",
            java: "class Solution {\n    public boolean isPalindrome(String s) {\n        \n    }\n}"
        },
        example: [
            { input: "s = 'A man, a plan, a canal: Panama'", output: "true", explaination: "'amanaplanacanalpanama' is a palindrome." },
            { input: "s = 'race a car'", output: "false", explaination: "'raceacar' is not a palindrome." }
        ],
        testCases: [
            { input: "\"A man, a plan, a canal: Panama\"", expectedOutput: "true" },
            { input: "\"race a car\"", expectedOutput: "false" }
        ],
        constraints: ["1 <= s.length <= 2 * 10^5", "s consists only of printable ASCII characters."],
        topicTags: ["Two Pointers", "String"]
    },
    206: {
        leetcodeId: 206,
        title: "Reverse Linked List",
        difficulty: "easy",
        description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
        starterCode: "function reverseList(head) {\n    // Write your code here\n}",
        starterCodes: {
            javascript: "function reverseList(head) {\n    // Write your code here\n}",
            python: "def reverseList(head):\n    pass",
            java: "/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode() {}\n *     ListNode(int val) { this.val = val; }\n *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n * }\n */\nclass Solution {\n    public ListNode reverseList(ListNode head) {\n        \n    }\n}"
        },
        example: [
            { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]", explaination: "Reversed list elements." },
            { input: "head = [1,2]", output: "[2,1]", explaination: "Reversed 2 nodes." }
        ],
        testCases: [
            { input: "[1,2,3,4,5]", expectedOutput: "[5,4,3,2,1]" },
            { input: "[1,2]", expectedOutput: "[2,1]" }
        ],
        constraints: ["The number of nodes in the list is the range [0, 5000].", "-5000 <= Node.val <= 5000"],
        topicTags: ["Linked List", "Recursion"]
    },
    217: {
        leetcodeId: 217,
        title: "Contains Duplicate",
        difficulty: "easy",
        description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
        starterCode: "function containsDuplicate(nums) {\n    // Write your code here\n}",
        starterCodes: {
            javascript: "function containsDuplicate(nums) {\n    // Write your code here\n}",
            python: "def containsDuplicate(nums: list[int]) -> bool:\n    pass",
            java: "class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        \n    }\n}"
        },
        example: [
            { input: "nums = [1,2,3,1]", output: "true", explaination: "1 appears twice." },
            { input: "nums = [1,2,3,4]", output: "false", explaination: "All distinct." }
        ],
        testCases: [
            { input: "[1,2,3,1]", expectedOutput: "true" },
            { input: "[1,2,3,4]", expectedOutput: "false" },
            { input: "[1,1,1,3,3,4,3,2,4,2]", expectedOutput: "true" }
        ],
        constraints: ["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
        topicTags: ["Array", "Hash Table", "Sorting"]
    },
    242: {
        leetcodeId: 242,
        title: "Valid Anagram",
        difficulty: "easy",
        description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
        starterCode: "function isAnagram(s, t) {\n    // Write your code here\n}",
        starterCodes: {
            javascript: "function isAnagram(s, t) {\n    // Write your code here\n}",
            python: "def isAnagram(s: str, t: str) -> bool:\n    pass",
            java: "class Solution {\n    public boolean isAnagram(String s, String t) {\n        \n    }\n}"
        },
        example: [
            { input: "s = 'anagram', t = 'nagaram'", output: "true", explaination: "All letters match in frequency." },
            { input: "s = 'rat', t = 'car'", output: "false", explaination: "Different letters." }
        ],
        testCases: [
            { input: "\"anagram\"\n\"nagaram\"", expectedOutput: "true" },
            { input: "\"rat\"\n\"car\"", expectedOutput: "false" }
        ],
        constraints: ["1 <= s.length, t.length <= 5 * 10^4", "s and t consist of lowercase English letters."],
        topicTags: ["Hash Table", "String", "Sorting"]
    },
    198: {
        leetcodeId: 198,
        title: "House Robber",
        difficulty: "medium",
        description: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night.\n\nGiven an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.",
        starterCode: "/**\n * @param {number[]} nums\n * @return {number}\n */\nfunction rob(nums) {\n    // Write your solution here\n    \n}",
        starterCodes: {
            javascript: "function rob(nums) {\n    // Write your solution here\n    \n}",
            python: "class Solution:\n    def rob(self, nums: list[int]) -> int:\n        pass",
            cpp: "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int rob(vector<int>& nums) {\n        \n    }\n};",
            java: "class Solution {\n    public int rob(int[] nums) {\n        \n    }\n}"
        },
        example: [
            {
                input: "nums = [1,2,3,1]",
                output: "4",
                explaination: "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount you can rob = 1 + 3 = 4."
            },
            {
                input: "nums = [2,7,9,3,1]",
                output: "12",
                explaination: "Rob house 1 (money = 2), rob house 3 (money = 9) and rob house 5 (money = 1). Total amount you can rob = 2 + 9 + 1 = 12."
            }
        ],
        testCases: [
            { input: "[1,2,3,1]", expectedOutput: "4" },
            { input: "[2,7,9,3,1]", expectedOutput: "12" }
        ],
        constraints: [
            "1 <= nums.length <= 100",
            "0 <= nums[i] <= 400"
        ],
        topicTags: ["Array", "Dynamic Programming"]
    }
};

/**
 * Strips HTML tags and unescapes basic HTML entities for human-readable markdown/text
 */
function stripHtml(html) {
    if (!html) return "";
    return html
        .replace(/<pre>[\s\S]*?<\/pre>/gi, (match) => match.replace(/<[^>]+>/g, ""))
        .replace(/<code>(.*?)<\/code>/gi, "`$1`")
        .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**")
        .replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*")
        .replace(/<p>/gi, "\n\n")
        .replace(/<\/p>/gi, "")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<li>/gi, "\n- ")
        .replace(/<\/li>/gi, "")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
}

/**
 * Parses examples and testcases out of HTML content
 */
function extractExamplesAndTestCases(content, sampleTestCase, exampleTestcases) {
    const examples = [];
    const testCases = [];

    // Match Example blocks with any HTML attributes (e.g. <strong class="example">Example 1:</strong>)
    const exampleRegex = /<(?:strong|b)[^>]*>\s*Example\s*(\d+)?:?\s*<\/(?:strong|b)>[\s\S]*?<pre>([\s\S]*?)<\/pre>/gi;
    let match;
    while ((match = exampleRegex.exec(content)) !== null) {
        const rawExample = match[2];
        const inputMatch = /(?:Input|Given):\s*([\s\S]*?)(?=(?:Output|Result):|$)/i.exec(rawExample);
        const outputMatch = /(?:Output|Result):\s*([\s\S]*?)(?=(?:Explanation|Note):|$)/i.exec(rawExample);
        const explMatch = /(?:Explanation|Note):\s*([\s\S]*?)$/i.exec(rawExample);

        const inputStr = inputMatch ? stripHtml(inputMatch[1]).trim() : "";
        const outputStr = outputMatch ? stripHtml(outputMatch[1]).trim() : "";
        const explStr = explMatch ? stripHtml(explMatch[1]).trim() : "";

        if (inputStr) {
            examples.push({
                input: inputStr,
                output: outputStr,
                explaination: explStr
            });
            testCases.push({
                input: inputStr,
                expectedOutput: outputStr
            });
        }
    }

    // Secondary fallback: find any <pre> block containing Input: and Output:
    if (testCases.length === 0) {
        const preRegex = /<pre>([\s\S]*?)<\/pre>/gi;
        let preMatch;
        while ((preMatch = preRegex.exec(content)) !== null) {
            const rawExample = preMatch[1];
            if (/Input:/i.test(rawExample) && /Output:/i.test(rawExample)) {
                const inputMatch = /(?:Input|Given):\s*([\s\S]*?)(?=(?:Output|Result):|$)/i.exec(rawExample);
                const outputMatch = /(?:Output|Result):\s*([\s\S]*?)(?=(?:Explanation|Note):|$)/i.exec(rawExample);
                const explMatch = /(?:Explanation|Note):\s*([\s\S]*?)$/i.exec(rawExample);

                const inputStr = inputMatch ? stripHtml(inputMatch[1]).trim() : "";
                const outputStr = outputMatch ? stripHtml(outputMatch[1]).trim() : "";
                const explStr = explMatch ? stripHtml(explMatch[1]).trim() : "";

                if (inputStr) {
                    examples.push({
                        input: inputStr,
                        output: outputStr,
                        explaination: explStr
                    });
                    testCases.push({
                        input: inputStr,
                        expectedOutput: outputStr
                    });
                }
            }
        }
    }

    // Fallback: raw exampleTestcases
    if (testCases.length === 0 && exampleTestcases) {
        const rawCases = exampleTestcases.includes('\n\n')
            ? exampleTestcases.split('\n\n').filter(Boolean)
            : exampleTestcases.split('\n').filter(Boolean);
        rawCases.forEach((rc) => {
            testCases.push({
                input: rc.trim(),
                expectedOutput: ""
            });
        });
    }

    if (testCases.length === 0 && sampleTestCase) {
        testCases.push({
            input: sampleTestCase.trim(),
            expectedOutput: ""
        });
    }

    return { examples, testCases };
}

let problemListCache = null;
let lastCacheTime = 0;

async function getLeetCodeProblemList() {
    const now = Date.now();
    if (problemListCache && (now - lastCacheTime < 1000 * 60 * 60)) {
        return problemListCache;
    }

    try {
        const res = await fetch("https://leetcode.com/api/problems/all/", {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
        });
        if (res.ok) {
            const data = await res.json();
            problemListCache = data.stat_status_pairs || [];
            lastCacheTime = now;
            return problemListCache;
        }
    } catch (e) {
        console.warn("Could not fetch LeetCode problem list online:", e.message);
    }
    return [];
}

/**
 * Fetch a LeetCode problem by its question number (e.g. 1 for Two Sum)
 */
async function fetchLeetCodeByNumber(problemNumber) {
    const num = parseInt(problemNumber, 10);
    if (isNaN(num) || num <= 0) {
        throw new Error("Invalid problem number. Please enter a valid number like 1, 20, 53.");
    }

    // 1. Check curated database first
    if (CURATED_LEETCODE_PROBLEMS[num]) {
        return CURATED_LEETCODE_PROBLEMS[num];
    }

    // 2. Fetch live from LeetCode
    try {
        const problemList = await getLeetCodeProblemList();
        const found = problemList.find(p => p.stat && p.stat.frontend_question_id === num);

        if (!found) {
            throw new Error(`Problem #${num} not found on LeetCode.`);
        }

        const titleSlug = found.stat.question__title_slug;
        const query = {
            query: `query getQuestionDetail($titleSlug: String!) {
              question(titleSlug: $titleSlug) {
                questionFrontendId
                title
                titleSlug
                content
                difficulty
                exampleTestcases
                sampleTestCase
                codeSnippets {
                  lang
                  langSlug
                  code
                }
                topicTags {
                  name
                }
              }
            }`,
            variables: { titleSlug }
        };

        const res = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            },
            body: JSON.stringify(query)
        });

        if (!res.ok) {
            throw new Error(`LeetCode GraphQL error: ${res.statusText}`);
        }

        const data = await res.json();
        const q = data?.data?.question;
        if (!q) {
            throw new Error(`Could not load details for LeetCode #${num}`);
        }

        let rawContent = q.content || "";
        if (!rawContent || rawContent.trim().length === 0) {
            // Attempt to fetch from open-source archive for premium/locked LeetCode questions
            try {
                const pad = String(num).padStart(4, '0');
                const folderStart = String(Math.floor(num / 100) * 100).padStart(4, '0');
                const folderEnd = String(Math.floor(num / 100) * 100 + 99).padStart(4, '0');
                const folder = `${folderStart}-${folderEnd}`;
                const encodedTitle = encodeURIComponent((q.title || "").replace(/\//g, ' '));
                const archiveUrl = `https://raw.githubusercontent.com/doocs/leetcode/main/solution/${folder}/${pad}.${encodedTitle}/README_EN.md`;
                const archiveRes = await fetch(archiveUrl);
                if (archiveRes.ok) {
                    const mdText = await archiveRes.text();
                    const descMatch = /## Description[\s\S]*?<!-- description:start -->([\s\S]*?)<!-- description:end -->/i.exec(mdText);
                    if (descMatch) {
                        rawContent = descMatch[1].trim();
                    } else {
                        rawContent = mdText;
                    }
                }
            } catch (archiveErr) {
                console.warn("Could not fetch from archive:", archiveErr.message);
            }
        }

        let cleanDesc = stripHtml(rawContent);
        if (!cleanDesc || cleanDesc.trim().length === 0) {
            cleanDesc = `Given the problem requirements for "${q.title}" (${(q.topicTags?.map(t => t.name) || []).join(', ') || 'Algorithms'}).\n\nImplement an optimal algorithm to solve this problem adhering to standard time and space complexity constraints.`;
        }

        const { examples, testCases } = extractExamplesAndTestCases(
            rawContent || "",
            q.sampleTestCase,
            q.exampleTestcases
        );

        const jsSnippet = q.codeSnippets?.find(s => s.langSlug === "javascript")?.code || "";
        const pySnippet = q.codeSnippets?.find(s => s.langSlug === "python3" || s.langSlug === "python")?.code || "";
        const cppSnippet = q.codeSnippets?.find(s => s.langSlug === "cpp")?.code || "";
        const javaSnippet = q.codeSnippets?.find(s => s.langSlug === "java")?.code || "";

        return {
            leetcodeId: num,
            title: q.title,
            difficulty: (q.difficulty || "medium").toLowerCase(),
            description: cleanDesc,
            starterCode: jsSnippet || pySnippet || "// Write your solution here\n",
            starterCodes: {
                javascript: jsSnippet,
                python: pySnippet,
                cpp: cppSnippet,
                java: javaSnippet
            },
            example: examples,
            testCases: testCases.length > 0 ? testCases : [{ input: q.sampleTestCase || "", expectedOutput: "" }],
            constraints: [],
            topicTags: q.topicTags?.map(t => t.name) || []
        };
    } catch (err) {
        console.error(`Error fetching LeetCode problem #${num}:`, err.message);
        throw new Error(`Failed to load LeetCode problem #${num}: ${err.message}`);
    }
}

function getCuratedProblemsList() {
    return Object.values(CURATED_LEETCODE_PROBLEMS).map(p => ({
        id: p.leetcodeId,
        title: p.title,
        difficulty: p.difficulty,
        topicTags: p.topicTags
    }));
}

module.exports = {
    fetchLeetCodeByNumber,
    getCuratedProblemsList,
    CURATED_LEETCODE_PROBLEMS
};
