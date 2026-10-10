const editSocket = (io, socket) => {
    socket.on("code-change", ({ roomId, interviewId, code }) => {
        const targetRoom = roomId || interviewId || socket.roomId;
        if (!targetRoom) return;

        // Broadcast to everyone else in the room
        socket.to(targetRoom).emit("code-update", { code });
        socket.to(targetRoom).emit("code-change", { code });
    });

    socket.on("language-change", ({ roomId, interviewId, language, Language }) => {
        const targetRoom = roomId || interviewId || socket.roomId;
        const selectedLang = language || Language;
        if (!targetRoom || !selectedLang) return;

        socket.to(targetRoom).emit("language-update", { language: selectedLang });
    });
};

module.exports = editSocket;