import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../../redux/slices/editorSlice';
import { getSocket } from '../../services/socket.service';

const LanguageSelector = ({ interviewId }) => {
    const { language } = useSelector((state) => state.editor);
    const dispatch = useDispatch();

    const handleLanguage = (e) => {
        const newLang = e.target.value;
        dispatch(setLanguage(newLang));

        const socket = getSocket();
        if (socket && interviewId) {
            socket.emit("language-change", {
                interviewId,
                language: newLang
            });
        }
    };

    return (
        <select
            value={language}
            onChange={handleLanguage}
            className="bg-[#0e0e0e] text-gray-200 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-primary transition-colors cursor-pointer"
        >
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="python">Python 3</option>
            <option value="cpp">C++ (GCC)</option>
            <option value="java">Java (OpenJDK)</option>
        </select>
    );
};

export default LanguageSelector;