let peerConnection = null;
let localStream = null;

const ICE_SERVER = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        }
    ]
}

export const createPeerConnection = () => {
    if (peerConnection) {
        return peerConnection
    }

    peerConnection = new RTCPeerConnection(
        ICE_SERVER
    )
    peerConnection.onicecandidate=(event)=>{
        if(event.candidate){
            console.log("New ICE candidate:",event.candidate);
        }
    }
    return peerConnection;
}

export const getPeerConnection = () => {
    return peerConnection;
}

export const closePeerConnection = () => {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null
    }
}

export const getLocalStream = async () => {
    if (localStream) {
        return localStream
    }

    localStream = await navigator.mediaDevices.getUserMedia(
        {
            video: true,
            audio: true
        }
    )

    return localStream;
}

export const addLocalTracks=async () => {
    const stream=await getLocalStream()
    const peer= createPeerConnection();

    const existingSenders =peer.getSenders().map(sender=>sender.track)

    stream.getTracks().forEach(track => {
        if(!existingSenders.includes(track)){
            peer.addTrack(
                track,
                stream
            );
        }
    });

    return peer;
}

export const createOffer=async () => {
    const peer= await addLocalTracks();
    const offer= await peer.createOffer()
    await peer.setLocalDescription(offer);

    return offer;
}

export const createAnswer=async (offer) => {
    const peer= await addLocalTracks();

    await peer.setRemoteDescription(
        new RTCSessionDescription(offer)
    )

    const answer= await peer.createAnswer();

    await peer.setLocalDescription(answer);

    return answer;
}