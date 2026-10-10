/**
 * Starter Code resolver and templates for supported programming languages.
 * Automatically resolves language-specific pre-code from LeetCode problem data.
 */

export const CURATED_JAVA_STARTERS = {
  1: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`,
  2: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        
    }
}`,
  9: `class Solution {
    public boolean isPalindrome(int x) {
        
    }
}`,
  20: `class Solution {
    public boolean isValid(String s) {
        
    }
}`,
  21: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        
    }
}`,
  53: `class Solution {
    public int maxSubArray(int[] nums) {
        
    }
}`,
  70: `class Solution {
    public int climbStairs(int n) {
        
    }
}`,
  121: `class Solution {
    public int maxProfit(int[] prices) {
        
    }
}`,
  125: `class Solution {
    public boolean isPalindrome(String s) {
        
    }
}`,
  206: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode reverseList(ListNode head) {
        
    }
}`,
  217: `class Solution {
    public boolean containsDuplicate(int[] nums) {
        
    }
}`,
  242: `class Solution {
    public boolean isAnagram(String s, String t) {
        
    }
}`,
};

/**
 * Resolves the starter code for a specific programming language from a question object.
 * @param {Object} question - The question object containing title, starterCode, starterCodes, etc.
 * @param {string} language - Target language ('javascript', 'java', 'python', 'cpp')
 * @returns {string} - The starter code for the specified language
 */
export const getStarterCodeForLanguage = (question, language = 'javascript') => {
  const lang = (language || 'javascript').toLowerCase();

  // If no question is active, provide language defaults
  if (!question) {
    if (lang === 'java') {
      return `class Solution {\n    // Write your solution here\n    \n}`;
    }
    if (lang === 'python') {
      return `class Solution:\n    # Write your solution here\n    pass`;
    }
    if (lang === 'cpp') {
      return `#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Write your solution here\n};`;
    }
    return `function solution() {\n    // Write your code here\n    \n}`;
  }

  // 1. JAVA
  if (lang === 'java') {
    // Check question's starterCodes.java or starterCodes.Java
    if (question.starterCodes?.java && question.starterCodes.java.trim()) {
      return question.starterCodes.java;
    }
    if (question.starterCodes?.Java && question.starterCodes.Java.trim()) {
      return question.starterCodes.Java;
    }

    // Check curated mapping by leetcodeId
    const lcId = question.leetcodeId || question.id;
    if (lcId && CURATED_JAVA_STARTERS[lcId]) {
      return CURATED_JAVA_STARTERS[lcId];
    }

    // Check curated mapping by title match
    const title = (question.title || '').toLowerCase();
    for (const [id, code] of Object.entries(CURATED_JAVA_STARTERS)) {
      if (
        (title.includes('two sum') && id === '1') ||
        (title.includes('add two numbers') && id === '2') ||
        (title.includes('palindrome number') && id === '9') ||
        (title.includes('valid parentheses') && id === '20') ||
        (title.includes('merge two sorted') && id === '21') ||
        (title.includes('maximum subarray') && id === '53') ||
        (title.includes('climbing stairs') && id === '70') ||
        (title.includes('stock') && id === '121') ||
        (title.includes('valid palindrome') && id === '125') ||
        (title.includes('reverse linked list') && id === '206') ||
        (title.includes('contains duplicate') && id === '217') ||
        (title.includes('valid anagram') && id === '242')
      ) {
        return code;
      }
    }

    // Generate dynamic Java template from JavaScript function signature
    const jsSource = question.starterCode || question.starterCodes?.javascript || '';
    const fnMatch = jsSource.match(/function\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)/);
    if (fnMatch) {
      const fnName = fnMatch[1];
      const rawParams = fnMatch[2].split(',').map((p) => p.trim()).filter(Boolean);
      const javaParams = rawParams.map((p) => {
        if (p.toLowerCase().includes('nums') || p.toLowerCase().includes('arr')) return `int[] ${p}`;
        if (p.toLowerCase().includes('target') || p.toLowerCase().includes('val') || p.toLowerCase().includes('n') || p.toLowerCase().includes('k')) return `int ${p}`;
        if (p.toLowerCase().includes('s') || p.toLowerCase().includes('str') || p.toLowerCase().includes('t')) return `String ${p}`;
        return `Object ${p}`;
      });

      return `class Solution {\n    public void ${fnName}(${javaParams.join(', ')}) {\n        // Write your solution here\n        \n    }\n}`;
    }

    return `class Solution {\n    // Solution for ${question.title || 'LeetCode Problem'}\n    public void solve() {\n        // Write your solution here\n        \n    }\n}`;
  }

  // 2. JAVASCRIPT
  if (lang === 'javascript' || lang === 'js') {
    if (question.starterCodes?.javascript && question.starterCodes.javascript.trim()) {
      return question.starterCodes.javascript;
    }
    if (question.starterCode && question.starterCode.trim()) {
      return question.starterCode;
    }
    return `function solution() {\n    // Write your code here\n    \n}`;
  }

  // 3. PYTHON
  if (lang === 'python' || lang === 'py') {
    if (question.starterCodes?.python && question.starterCodes.python.trim()) {
      return question.starterCodes.python;
    }
    if (question.starterCodes?.python3 && question.starterCodes.python3.trim()) {
      return question.starterCodes.python3;
    }
    return `class Solution:\n    # Write your solution here\n    pass`;
  }

  // 4. C++
  if (lang === 'cpp' || lang === 'c++') {
    if (question.starterCodes?.cpp && question.starterCodes.cpp.trim()) {
      return question.starterCodes.cpp;
    }
    return `#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Write your solution here\n};`;
  }

  // Fallback
  return question.starterCode || `// Write your ${language} solution here\n`;
};
