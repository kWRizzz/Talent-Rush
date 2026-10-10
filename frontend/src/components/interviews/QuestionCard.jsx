import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectedQuestion as selectQuestion } from '../../redux/slices/questionSlice';
import { setCode, clearTestResults } from '../../redux/slices/editorSlice';
import { getSocket } from '../../services/socket.service';
import { getStarterCodeForLanguage } from '../../utils/starterCode';

const QuestionCard = ({ question, index, interviewId }) => {
    const dispatch = useDispatch();

    const { selectedQuestion } = useSelector(
        (state) => state.question
    );
    const { language } = useSelector(
        (state) => state.editor
    );

    const isSelected = selectedQuestion?._id === question._id;

    const handleSelect = () => {
        dispatch(selectQuestion(question));
        dispatch(clearTestResults());
        const starter = getStarterCodeForLanguage(question, language);
        if (starter) {
            dispatch(setCode(starter));
        }

        // Notify other participants in the room
        const socket = getSocket();
        if (socket && interviewId) {
            socket.emit("question-selected", {
                interviewId,
                question
            });
            if (starter) {
                socket.emit("code-change", {
                    interviewId,
                    code: starter
                });
            }
        }
    };

    const difficultyColors = {
        easy: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        hard: "bg-rose-500/10 text-rose-400 border-rose-500/20"
    };

    const diff = (question.difficulty || "medium").toLowerCase();

    return (
        <div
            onClick={handleSelect}
            className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                isSelected
                    ? "bg-[#1f1d2b] border-primary shadow-[0_0_20px_rgba(46,91,255,0.25)]"
                    : "bg-[#181818] border-white/5 hover:border-white/20 hover:bg-[#202020]"
            }`}
        >
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-white tracking-wide">
                    {question.title}
                </span>
                <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        difficultyColors[diff] || difficultyColors.medium
                    }`}
                >
                    {question.difficulty || "Medium"}
                </span>
            </div>

            <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                {question.description}
            </p>

            <div className="mt-2.5 flex items-center justify-between text-[10px] text-gray-500 pt-2 border-t border-white/5">
                <span>
                    {question.testCases?.length || 0} Test Cases
                </span>
                {isSelected && (
                    <span className="text-primary font-medium flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1 animate-pulse"></span>
                        Active in Editor
                    </span>
                )}
            </div>
        </div>
    );
};

export default QuestionCard;