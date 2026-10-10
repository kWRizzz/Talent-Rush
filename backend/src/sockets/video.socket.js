const {
    OFFER,
    ANSWER,
    ICE_CANDIDATE
} = require('./constants')


const videoSocket = (io, socket) => {

    socket.on(
        OFFER,
        ({ roomId, offer }) => {
            socket.to(roomId).emit(
                OFFER,
                { offer }
            )
        }
    )



    socket.on(
        ANSWER,
        ({ roomId, answer }) => {
            socket.to(roomId).emit(
                ANSWER,
                { answer }
            )
        }
    )

    socket.on(
        ICE_CANDIDATE,
        ({ roomId, candidate }) => {
            ICE_CANDIDATE,
                { candidate }
        }
    )

    socket.on(
        "answer",
        ({ interviewId, answer, targetId }) => {
            if (!targetId || !answer) {
                return
            }

            socket.to(targetId).emit("answer", {
                answer,
                senderId: socket.roomId
            })
        }
    )

    socket.on(
        "ice-cadidate",
        ({ interviewId, candidate, targetId }) => {
            if (!candidate || !targetId) {
                return
            }

            socket.to(targetId).emit("ice-candidate", {
                candidate,
                senderId: socket.id,
            })
        }
    )

    socket.on(
        "offer", ({ interviewId, offer }) => {
            socket.to(interviewId).emit("offer", {
                offer,
                senderId: socket.roomId
            })
        }
    )

    socket.on(
        "answer", ({ answer, targetId }) => {
            if (!answer || !targetId) {
                console.warn("Answer or targetId missing");
                return
            }
            socket.to(targetId).emit("answer", {
                answer,
                senderId: socket.roomId
            })

        }
    )


    socket.on(
        "ice-candidate",
        ({ candidate, targetId }) => {
            if (!candidate || !targetId) {
                console.warn("ICE candidate or targetId missing");
                return;
            }

            socket.to(targetId).emit("ice-candidate", {
                candidate,
                senderId: socket.id,
            });
        }
    );

}

const registerVideoSocket = async (io, socket) => {
    socket.on(
        OFFER, ({ interviewId, offer }) => {
            socket.to(interviewId).emit(OFFER, {
                offer,
                senderId: socket.roomId
            })
        }
    )
}
module.exports = {
    videoSocket,
    registerVideoSocket



}