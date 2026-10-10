import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage, setCode } from '../../redux/slices/editorSlice';
import { getSocket } from '../../services/socket.service';
import { getStarterCodeForLanguage } from '../../utils/starterCode';

const LanguageSelector = ({ interviewId }) => {
    const { language } = useSelector((state) => state.editor);
    const selectedQuestion = useSelector((state) => state.question?.selectedQuestion);
    const dispatch = useDispatch();

    const handleLanguage = (e) => {
        const newLang = e.target.value;
        dispatch(setLanguage(newLang));

        // When language changes (e.g. JS -> Java), automatically load the pre-code for that question
        const newStarterCode = getStarterCodeForLanguage(selectedQuestion, newLang);
        if (newStarterCode) {
            dispatch(setCode(newStarterCode));
        }

        const socket = getSocket();
        if (socket && interviewId) {
            socket.emit("language-change", {
                interviewId,
                language: newLang
            });
            if (newStarterCode) {
                socket.emit("code-change", {
                    interviewId,
                    code: newStarterCode
                });
            }
        }
    };

    return (
        <select
            value={language}
            onChange={handleLanguage}
            className="bg-[#0e0e0e] text-gray-200 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-primary transition-colors cursor-pointer"
        >
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="java">Java (OpenJDK)</option>
            <option value="python">Python 3</option>
            <option value="cpp">C++ (GCC)</option>
        </select>
    );
};

export default LanguageSelector;