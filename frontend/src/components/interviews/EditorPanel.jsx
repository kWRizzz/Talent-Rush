import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCode,
  setLanguage,
  runTests,
  submitSolution,
} from '../../redux/slices/editorSlice';
import Editor from '@monaco-editor/react';
import LanguageSelector from './LanguageSelector';
import { getStarterCodeForLanguage } from '../../utils/starterCode';
import { getSocket } from '../../services/socket.service';
import {
  FiPlay,
  FiCheckCircle,
  FiRotateCcw,
  FiLoader,
  FiTerminal,
} from 'react-icons/fi';

const EditorPanel = ({ interviewId }) => {
  const { code, language, isTesting, isSubmitting, isRunning } = useSelector(
    (state) => state.editor
  );
  const selectedQuestion = useSelector((state) => state.question?.selectedQuestion);
  const currentUser = useSelector((state) => state.auth?.user);

  const dispatch = useDispatch();
  const isRemoteUpdateRef = useRef(false);

  const handleChange = (value) => {
    const newCode = value || '';
    dispatch(setCode(newCode));

    if (!isRemoteUpdateRef.current) {
      const socket = getSocket();
      if (socket && interviewId) {
        socket.emit('code-change', {
          interviewId,
          code: newCode,
        });
      }
    }
    isRemoteUpdateRef.current = false;
  };

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleCodeUpdate = ({ code: incomingCode }) => {
      isRemoteUpdateRef.current = true;
      dispatch(setCode(incomingCode));
    };

    const handleLanguageUpdate = ({ language: incomingLang }) => {
      if (incomingLang) {
        dispatch(setLanguage(incomingLang));
      }
    };

    socket.on('code-update', handleCodeUpdate);
    socket.on('code-change', handleCodeUpdate);
    socket.on('language-update', handleLanguageUpdate);

    return () => {
      socket.off('code-update', handleCodeUpdate);
      socket.off('code-change', handleCodeUpdate);
      socket.off('language-update', handleLanguageUpdate);
    };
  }, [dispatch]);

  const handleRunCode = () => {
    const testCases = selectedQuestion?.testCases || [];
    dispatch(runTests(testCases));
  };

  const handleSubmitSolution = async () => {
    if (!selectedQuestion) {
      handleRunCode();
      return;
    }

    try {
      const res = await dispatch(
        submitSolution({
          interviewId,
          questionId: selectedQuestion._id,
        })
      ).unwrap();

      const socket = getSocket();
      if (socket && interviewId && res?.submission) {
        socket.emit('solution-submitted', {
          interviewId,
          submission: res.submission,
          senderName: currentUser?.name || 'Candidate',
        });
      }
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  const handleResetCode = () => {
    const starter = getStarterCodeForLanguage(selectedQuestion, language);
    if (starter) {
      dispatch(setCode(starter));
      const socket = getSocket();
      if (socket && interviewId) {
        socket.emit('code-change', {
          interviewId,
          code: starter,
        });
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#131313] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      {/* Editor Header Toolbar */}
      <div className="px-4 py-2.5 bg-[#1a1919] border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 text-xs text-gray-300 font-medium">
            <FiTerminal className="text-primary" />
            <span className="text-white font-semibold">
              {selectedQuestion ? selectedQuestion.title : 'Code Editor'}
            </span>
          </div>
          {selectedQuestion && (
            <span className="text-[10px] bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded-full font-mono">
              {selectedQuestion.testCases?.length || 0} Test Cases
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <LanguageSelector interviewId={interviewId} />

          {selectedQuestion && (
            <button
              onClick={handleResetCode}
              title="Reset to starter code"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors cursor-pointer text-xs flex items-center"
            >
              <FiRotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Run Code Button */}
          <button
            onClick={handleRunCode}
            disabled={isTesting || isRunning || isSubmitting}
            className="flex items-center space-x-1.5 bg-[#262626] hover:bg-[#303030] border border-white/10 text-white px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-40 cursor-pointer shadow-sm"
          >
            {isTesting || isRunning ? (
              <>
                <FiLoader className="w-3.5 h-3.5 animate-spin text-primary" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <FiPlay className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                <span>Run Code</span>
              </>
            )}
          </button>

          {/* Submit Solution Button */}
          <button
            onClick={handleSubmitSolution}
            disabled={isSubmitting || isTesting}
            className="flex items-center space-x-1.5 bg-neon-gradient hover:opacity-90 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-[0_0_20px_rgba(46,91,255,0.3)] disabled:opacity-40 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <FiLoader className="w-3.5 h-3.5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <FiCheckCircle className="w-3.5 h-3.5" />
                <span>Submit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 w-full min-h-0" onKeyDown={(e) => e.stopPropagation()}>
        <Editor
          height="100%"
          theme="vs-dark"
          language={language === 'java' ? 'java' : (language === 'javascript' ? 'javascript' : language)}
          value={code}
          onChange={handleChange}
          options={{
            fontSize: 13,
            lineHeight: 20,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: language === 'java' ? 4 : 2,
            fontFamily: '"Fira Code", monospace, "Courier New"',
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: 'all',
          }}
        />
      </div>
    </div>
  );
};

export default EditorPanel;