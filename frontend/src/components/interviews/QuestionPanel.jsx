import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addLeetCodeQuestion,
  previewLeetCodeQuestion,
  selectedQuestion as selectQuestionAction,
  addQuestionToState,
} from '../../redux/slices/questionSlice';
import { setCode, clearTestResults } from '../../redux/slices/editorSlice';
import { getSocket } from '../../services/socket.service';
import QuestionCard from './QuestionCard';
import {
  FiPlus,
  FiCode,
  FiLayers,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiSearch,
  FiCheck,
} from 'react-icons/fi';

const QUICK_LEETCODE_PROBLEMS = [
  { id: 1, name: '1. Two Sum' },
  { id: 20, name: '20. Valid Parentheses' },
  { id: 121, name: '121. Best Stock' },
  { id: 53, name: '53. Max Subarray' },
  { id: 70, name: '70. Climbing Stairs' },
  { id: 206, name: '206. Reverse List' },
];

const QuestionPanel = ({ interviewId }) => {
  const dispatch = useDispatch();
  const [problemNumber, setProblemNumber] = useState('');
  const [activeTab, setActiveTab] = useState('detail'); // "detail" | "list"
  const [showAddForm, setShowAddForm] = useState(false);

  const {
    question: questions,
    selectedQuestion,
    searchedQuestion,
    isLoading,
    isAddingLeetCode,
    isSearchingLeetCode,
    error,
    leetCodeError,
  } = useSelector((state) => state.question);

  const activeQuestion = selectedQuestion || searchedQuestion;

  // Sync questions from socket when other peer adds or selects one
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleQuestionAdded = ({ question }) => {
      if (question) {
        dispatch(addQuestionToState(question));
      }
    };

    const handleQuestionSelected = ({ question }) => {
      if (question) {
        dispatch(selectQuestionAction(question));
        dispatch(clearTestResults());
        if (question.starterCode) {
          dispatch(setCode(question.starterCode));
        }
      }
    };

    socket.on('question-added', handleQuestionAdded);
    socket.on('question-selected', handleQuestionSelected);

    return () => {
      socket.off('question-added', handleQuestionAdded);
      socket.off('question-selected', handleQuestionSelected);
    };
  }, [dispatch]);

  const handleSearchLeetCode = async (numToFetch) => {
    const num = numToFetch || problemNumber;
    if (!num) return;

    try {
      const result = await dispatch(previewLeetCodeQuestion(num)).unwrap();
      if (result) {
        if (result.starterCode) {
          dispatch(setCode(result.starterCode));
        }
        setActiveTab('detail');
      }
    } catch (err) {
      console.error('Failed to preview LeetCode problem:', err);
    }
  };

  const handleAddLeetCode = async (numToFetch) => {
    const num = numToFetch || problemNumber;
    if (!num) return;

    try {
      const result = await dispatch(
        addLeetCodeQuestion({
          interviewId,
          questionNumber: num,
        })
      ).unwrap();

      if (result) {
        // Broadcast to other participants
        const socket = getSocket();
        if (socket && interviewId) {
          socket.emit('question-added', {
            interviewId,
            question: result,
          });
        }
        if (result.starterCode) {
          dispatch(setCode(result.starterCode));
        }
        setProblemNumber('');
        setShowAddForm(false);
        setActiveTab('detail');
      }
    } catch (err) {
      console.error('Failed to add LeetCode problem:', err);
    }
  };

  const difficultyColors = {
    easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  const diff = (activeQuestion?.difficulty || 'medium').toLowerCase();

  const isAlreadyInRoom =
    activeQuestion &&
    questions?.some(
      (q) =>
        q._id === activeQuestion._id ||
        (q.leetcodeId && q.leetcodeId === activeQuestion.leetcodeId)
    );

  return (
    <div className="flex flex-col h-full bg-[#131313] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      {/* Panel Header */}
      <div className="p-3 bg-[#1a1919] border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <FiCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Interview Questions</h3>
              <p className="text-[11px] text-gray-400">
                {questions?.length || 0} problem{questions?.length !== 1 ? 's' : ''} in room
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-xs bg-neon-gradient hover:opacity-90 text-white px-3 py-1.5 rounded-lg flex items-center space-x-1.5 font-medium transition-all shadow-[0_0_16px_rgba(46,91,255,0.25)] cursor-pointer"
          >
            <FiSearch className="w-3.5 h-3.5" />
            <span>Search Problem</span>
          </button>
        </div>

        {/* LeetCode Search & Add Drawer */}
        {showAddForm && (
          <div className="mt-3 p-3 bg-[#0e0e0e] border border-primary/30 rounded-xl space-y-2.5 animate-fadeIn">
            <div className="flex items-center justify-between text-xs text-gray-300">
              <span className="font-semibold text-white flex items-center">
                <FiSearch className="mr-1 text-primary" /> Search LeetCode by Number
              </span>
              <span className="text-[10px] text-gray-500">Live API + Test Cases</span>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                placeholder="Enter LeetCode # (e.g. 1, 20, 53, 314)"
                value={problemNumber}
                onChange={(e) => setProblemNumber(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearchLeetCode();
                }}
                className="flex-1 bg-[#181818] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
              <button
                onClick={() => handleSearchLeetCode()}
                disabled={isSearchingLeetCode || isAddingLeetCode || !problemNumber}
                className="bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs px-3 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1 cursor-pointer"
              >
                {isSearchingLeetCode ? (
                  <FiLoader className="w-3 h-3 animate-spin" />
                ) : (
                  <span>Search</span>
                )}
              </button>

              <button
                onClick={() => handleAddLeetCode()}
                disabled={isAddingLeetCode || isSearchingLeetCode || !problemNumber}
                className="bg-primary hover:bg-primary/90 text-white text-xs px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1 cursor-pointer"
              >
                {isAddingLeetCode ? (
                  <FiLoader className="w-3 h-3 animate-spin" />
                ) : (
                  <span>+ Add</span>
                )}
              </button>
            </div>

            {/* Quick preset pills */}
            <div className="pt-1">
              <p className="text-[10px] text-gray-500 mb-1">Popular Interview Problems:</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_LEETCODE_PROBLEMS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSearchLeetCode(p.id)}
                    disabled={isSearchingLeetCode || isAddingLeetCode}
                    className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 text-gray-300 px-2 py-0.5 rounded-md transition-all cursor-pointer"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {leetCodeError && (
              <p className="text-[11px] text-red-400 flex items-center pt-1">
                <FiAlertCircle className="mr-1" /> {leetCodeError}
              </p>
            )}
          </div>
        )}

        {/* Tab switchers if multiple questions */}
        {questions?.length > 1 && (
          <div className="flex border-b border-white/5 mt-2 pt-1 text-xs">
            <button
              onClick={() => setActiveTab('detail')}
              className={`pb-1 px-3 border-b-2 font-medium transition-colors cursor-pointer ${
                activeTab === 'detail'
                  ? 'border-primary text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Active Problem
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`pb-1 px-3 border-b-2 font-medium transition-colors cursor-pointer ${
                activeTab === 'list'
                  ? 'border-primary text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              All Problems ({questions.length})
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 py-12">
            <FiLoader className="w-8 h-8 animate-spin text-primary mb-2" />
            <p className="text-xs">Loading questions...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
            <FiAlertCircle className="w-4 h-4 mb-1" />
            <p>{error}</p>
          </div>
        ) : !activeQuestion && (!questions || questions.length === 0) ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 py-12">
            <FiLayers className="w-10 h-10 mb-2 opacity-30 text-primary" />
            <h4 className="text-sm font-semibold text-white mb-1">No Questions Added</h4>
            <p className="text-xs text-gray-400 max-w-xs mb-4">
              Enter any LeetCode question number above (e.g. 1 for Two Sum) to load the problem with real test cases!
            </p>
            <button
              onClick={() => handleAddLeetCode(1)}
              className="bg-neon-gradient text-white text-xs px-4 py-2 rounded-xl font-medium shadow-[0_0_20px_rgba(46,91,255,0.3)] hover:opacity-90 transition-all cursor-pointer"
            >
              Load Example: 1. Two Sum
            </button>
          </div>
        ) : activeTab === 'list' ? (
          /* List of all questions in room */
          <div className="space-y-2.5">
            {questions.map((q, idx) => (
              <QuestionCard
                key={q._id || idx}
                question={q}
                index={idx}
                interviewId={interviewId}
              />
            ))}
          </div>
        ) : activeQuestion ? (
          /* Selected Question Detail View */
          <div className="space-y-4">
            {/* Title & Difficulty Header */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <h2 className="text-base font-bold text-white tracking-tight">
                  {activeQuestion.title}
                </h2>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      difficultyColors[diff] || difficultyColors.medium
                    }`}
                  >
                    {activeQuestion.difficulty || 'Medium'}
                  </span>
                  {!isAlreadyInRoom && activeQuestion.leetcodeId && (
                    <button
                      onClick={() => handleAddLeetCode(activeQuestion.leetcodeId)}
                      disabled={isAddingLeetCode}
                      className="text-[11px] bg-primary hover:bg-primary/90 text-white px-2.5 py-0.5 rounded-full font-medium transition cursor-pointer flex items-center space-x-1"
                    >
                      <FiPlus className="w-3 h-3" />
                      <span>Add to Room</span>
                    </button>
                  )}
                  {isAlreadyInRoom && (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium flex items-center">
                      <FiCheck className="mr-1" /> Added
                    </span>
                  )}
                </div>
              </div>

              {activeQuestion.topicTags && activeQuestion.topicTags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {activeQuestion.topicTags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-white/5 border border-white/5 text-gray-400 px-2 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* PROBLEM DESCRIPTION (Guaranteed to Display) */}
            <div className="space-y-1">
              <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-wider flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5"></span> Description
              </h4>
              <div className="text-xs text-gray-200 leading-relaxed whitespace-pre-line bg-[#0e0e0e] p-3.5 rounded-xl border border-white/5 font-sans">
                {activeQuestion.description && activeQuestion.description.trim().length > 0 ? (
                  activeQuestion.description
                ) : (
                  <div className="text-gray-400 italic">
                    Given the problem specifications for &quot;{activeQuestion.title}&quot;.
                    Solve this problem adhering to optimal time and space complexity constraints.
                    Refer to the example inputs and expected test outputs below.
                  </div>
                )}
              </div>
            </div>

            {/* Examples */}
            {activeQuestion.example && activeQuestion.example.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-wider flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5"></span> Examples
                </h4>
                {activeQuestion.example.map((ex, i) => (
                  <div
                    key={i}
                    className="p-3 bg-[#181818] border border-white/5 rounded-xl space-y-1 text-xs"
                  >
                    <div className="text-gray-400">
                      <strong className="text-white">Example {i + 1}:</strong>
                    </div>
                    {ex.input && (
                      <div className="font-mono text-[11px] bg-[#0e0e0e] p-2 rounded border border-white/5 text-gray-300">
                        <span className="text-primary font-bold">Input: </span>
                        {ex.input}
                      </div>
                    )}
                    {ex.output && (
                      <div className="font-mono text-[11px] bg-[#0e0e0e] p-2 rounded border border-white/5 text-gray-300">
                        <span className="text-emerald-400 font-bold">Output: </span>
                        {ex.output}
                      </div>
                    )}
                    {ex.explaination && (
                      <div className="text-[11px] text-gray-400 italic pt-1">
                        Explanation: {ex.explaination}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Constraints */}
            {activeQuestion.constraints && activeQuestion.constraints.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-wider flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-1.5"></span> Constraints
                </h4>
                <ul className="list-disc list-inside text-xs text-gray-400 space-y-1 bg-[#181818] p-3 rounded-xl border border-white/5 font-mono text-[11px]">
                  {activeQuestion.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* ACTUAL TEST CASES SECTION */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center">
                  <FiCheckCircle className="mr-1.5 text-emerald-400" />
                  Actual Test Cases ({activeQuestion.testCases?.length || 0})
                </h4>
                <span className="text-[10px] text-gray-500">Used for verification</span>
              </div>

              {activeQuestion.testCases && activeQuestion.testCases.length > 0 ? (
                <div className="space-y-2">
                  {activeQuestion.testCases.map((tc, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#181818] border border-white/5 rounded-xl space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span className="font-semibold text-white">Test Case {idx + 1}</span>
                        <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400 font-mono">
                          Standard Case
                        </span>
                      </div>

                      <div className="font-mono text-[11px] bg-[#0e0e0e] p-2 rounded border border-white/5 space-y-1">
                        <div>
                          <span className="text-primary font-bold">Input: </span>
                          <span className="text-gray-200">{tc.input}</span>
                        </div>
                        {tc.expectedOutput && (
                          <div>
                            <span className="text-emerald-400 font-bold">Expected Output: </span>
                            <span className="text-gray-200">{tc.expectedOutput}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-500 italic p-3 bg-[#181818] rounded-xl text-center">
                  No automated test cases configured.
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default QuestionPanel;