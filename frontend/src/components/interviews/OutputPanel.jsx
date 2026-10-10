import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  FiCheckCircle,
  FiXCircle,
  FiTerminal,
  FiClock,
  FiCheck,
  FiAlertCircle,
  FiLoader,
} from 'react-icons/fi';

const OutputPanel = () => {
  const {
    output,
    isRunning,
    isTesting,
    isSubmitting,
    testResults,
    allPassed,
    submissionResult,
  } = useSelector((state) => state.editor);

  const selectedQuestion = useSelector(
    (state) => state.question?.selectedQuestion
  );
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('tests'); // "tests" | "console" | "submission"

  const passedCount = testResults?.filter((r) => r.passed)?.length || 0;
  const totalCount = testResults?.length || 0;

  return (
    <div className="flex flex-col h-full bg-[#131313] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      {/* Panel Header */}
      <div className="px-4 py-2 bg-[#1a1919] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-1 text-xs">
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'tests'
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FiCheckCircle className="w-3.5 h-3.5" />
            <span>Test Results</span>
            {testResults && (
              <span
                className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  allPassed
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {passedCount}/{totalCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('console')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'console'
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FiTerminal className="w-3.5 h-3.5" />
            <span>Console</span>
          </button>

          {submissionResult && (
            <button
              onClick={() => setActiveTab('submission')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'submission'
                  ? 'bg-secondary/20 text-secondary border border-secondary/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FiCheck className="w-3.5 h-3.5" />
              <span>Submission</span>
            </button>
          )}
        </div>

        {/* Status Indicator */}
        <div className="text-xs">
          {isTesting || isRunning || isSubmitting ? (
            <span className="flex items-center text-primary text-xs font-medium">
              <FiLoader className="w-3 h-3 animate-spin mr-1.5" />
              Executing code...
            </span>
          ) : allPassed !== null && activeTab === 'tests' ? (
            <span
              className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${
                allPassed
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
            >
              {allPassed ? (
                <>
                  <FiCheckCircle className="mr-1" /> All Test Cases Passed!
                </>
              ) : (
                <>
                  <FiXCircle className="mr-1" /> {passedCount}/{totalCount} Passed
                </>
              )}
            </span>
          ) : null}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-zinc-700">
        {isTesting || isRunning || isSubmitting ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 py-10">
            <FiLoader className="w-8 h-8 animate-spin text-primary mb-2" />
            <p className="text-xs">Running code against test cases...</p>
          </div>
        ) : activeTab === 'tests' ? (
          /* Test Results Tab */
          !testResults || testResults.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 py-10 text-center">
              <FiTerminal className="w-8 h-8 opacity-30 text-primary mb-2" />
              <p className="text-xs text-gray-400">Click &quot;Run Code&quot; or &quot;Submit&quot; to test your solution</p>
              <p className="text-[11px] text-gray-600 mt-1">
                Your code will be evaluated against all test cases
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Test Case Selectors (Case 1, Case 2...) */}
              <div className="flex flex-wrap gap-2 border-b border-white/5 pb-3">
                {testResults.map((tc, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTestCaseIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer ${
                      selectedTestCaseIndex === idx
                        ? 'bg-[#262626] text-white border border-white/20 shadow-sm'
                        : 'bg-[#181818] text-gray-400 hover:text-white border border-transparent'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        tc.passed ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}
                    ></span>
                    <span>Case {idx + 1}</span>
                  </button>
                ))}
              </div>

              {/* Active Test Case Details */}
              {testResults[selectedTestCaseIndex] && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        testResults[selectedTestCaseIndex].passed
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {testResults[selectedTestCaseIndex].passed
                        ? 'Accepted (Passed)'
                        : 'Wrong Answer'}
                    </span>
                    {testResults[selectedTestCaseIndex].executionTimeMs !== undefined && (
                      <span className="text-[11px] text-gray-500 flex items-center">
                        <FiClock className="mr-1" />
                        {testResults[selectedTestCaseIndex].executionTimeMs} ms
                      </span>
                    )}
                  </div>

                  {/* Input Card */}
                  <div>
                    <label className="text-[11px] font-semibold text-gray-400 block mb-1">
                      Input
                    </label>
                    <pre className="font-mono text-xs bg-[#0e0e0e] text-gray-200 p-3 rounded-xl border border-white/5 overflow-x-auto whitespace-pre-wrap">
                      {testResults[selectedTestCaseIndex].input}
                    </pre>
                  </div>

                  {/* Expected Output Card */}
                  {testResults[selectedTestCaseIndex].expected && (
                    <div>
                      <label className="text-[11px] font-semibold text-gray-400 block mb-1">
                        Expected Output
                      </label>
                      <pre className="font-mono text-xs bg-[#0e0e0e] text-emerald-400 p-3 rounded-xl border border-white/5 overflow-x-auto whitespace-pre-wrap">
                        {testResults[selectedTestCaseIndex].expected}
                      </pre>
                    </div>
                  )}

                  {/* Your Output Card */}
                  <div>
                    <label className="text-[11px] font-semibold text-gray-400 block mb-1">
                      Your Output
                    </label>
                    <pre
                      className={`font-mono text-xs p-3 rounded-xl border border-white/5 overflow-x-auto whitespace-pre-wrap ${
                        testResults[selectedTestCaseIndex].passed
                          ? 'bg-[#0e0e0e] text-emerald-400'
                          : 'bg-[#1b1212] text-rose-400'
                      }`}
                    >
                      {testResults[selectedTestCaseIndex].actual}
                    </pre>
                  </div>

                  {/* Stdout / Console logs if any */}
                  {testResults[selectedTestCaseIndex].stdout && (
                    <div>
                      <label className="text-[11px] font-semibold text-gray-400 block mb-1">
                        Stdout
                      </label>
                      <pre className="font-mono text-xs bg-[#0e0e0e] text-gray-400 p-2.5 rounded-xl border border-white/5 overflow-x-auto">
                        {testResults[selectedTestCaseIndex].stdout}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        ) : activeTab === 'submission' ? (
          /* Submission Tab */
          submissionResult ? (
            <div className="space-y-4 py-2">
              <div
                className={`p-4 rounded-xl border text-center ${
                  submissionResult.status === 'accepted'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                <div className="text-2xl font-bold mb-1">
                  {submissionResult.status === 'accepted'
                    ? 'Accepted 🎉'
                    : 'Wrong Answer ❌'}
                </div>
                <div className="text-xs text-gray-300">
                  Passed {submissionResult.passedTestCases || 0} /{' '}
                  {submissionResult.totalTestCases || 0} Test Cases
                </div>
              </div>

              <div className="bg-[#0e0e0e] p-3 rounded-xl border border-white/5 text-xs text-gray-400 space-y-1">
                <div>
                  <strong className="text-white">Language:</strong>{' '}
                  {submissionResult.language}
                </div>
                <div>
                  <strong className="text-white">Submitted At:</strong>{' '}
                  {new Date(submissionResult.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-500 text-center py-8">
              No submission made yet. Click &quot;Submit&quot; to save your solution.
            </div>
          )
        ) : (
          /* Console Output Tab */
          <div>
            <pre className="font-mono text-xs bg-[#0e0e0e] text-gray-200 p-3.5 rounded-xl border border-white/5 min-h-[140px] whitespace-pre-wrap overflow-x-auto">
              {output || 'No console output.'}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;