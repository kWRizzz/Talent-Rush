import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  getLocalStream,
  addLocalTracks,
  createOffer,
  createAnswer,
  getPeerConnection,
  closePeerConnection,
} from "../../services/webrtc.service";
import { getSocket } from "../../services/socket.service";
import {
  FiVideo,
  FiVideoOff,
  FiMic,
  FiMicOff,
  FiPhoneCall,
  FiUser,
  FiWifi,
} from "react-icons/fi";

const VideoPanel = ({ interviewId }) => {
  const videoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const remoteSocketIdRef = useRef(null);
  const pendingLocalCandidatesRef = useRef([]);
  const pendingRemoteCandidatesRef = useRef([]);

  const [connectionState, setConnectionState] = useState("idle");
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [hasRemoteVideo, setHasRemoteVideo] = useState(false);

  const ensureMedia = useCallback(async () => {
    try {
      const stream = await getLocalStream();

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const peer = await addLocalTracks();

      peer.onconnectionstatechange = () => {
        setConnectionState(peer.connectionState);
      };

      peer.ontrack = (event) => {
        const remoteStream = event.streams?.[0];
        if (remoteVideoRef.current && remoteStream) {
          remoteVideoRef.current.srcObject = remoteStream;
          setHasRemoteVideo(true);
        }
      };

      peer.onicecandidate = (event) => {
        if (!event.candidate) return;

        const candidate = event.candidate.toJSON();
        const targetId = remoteSocketIdRef.current;

        if (!targetId) {
          pendingLocalCandidatesRef.current.push(candidate);
          return;
        }

        getSocket()?.emit("ice-candidate", {
          interviewId,
          candidate,
          targetId,
        });
      };

      return peer;
    } catch (err) {
      console.warn("Media device error:", err.message);
      return null;
    }
  }, [interviewId]);

  const flushLocalCandidates = useCallback(() => {
    const socket = getSocket();
    const targetId = remoteSocketIdRef.current;

    if (!targetId || !socket) return;

    const candidates = pendingLocalCandidatesRef.current.splice(0);
    candidates.forEach((candidate) => {
      socket.emit("ice-candidate", {
        interviewId,
        candidate,
        targetId,
      });
    });
  }, [interviewId]);

  const handleOffer = useCallback(
    async ({ offer, senderId }) => {
      try {
        remoteSocketIdRef.current = senderId;
        await ensureMedia();

        const answer = await createAnswer(offer);
        getSocket()?.emit("answer", {
          interviewId,
          answer,
          targetId: senderId,
        });

        flushLocalCandidates();
        setConnectionState("connected");
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    },
    [ensureMedia, flushLocalCandidates, interviewId]
  );

  const handleAnswer = useCallback(
    async ({ answer, senderId }) => {
      try {
        remoteSocketIdRef.current = senderId;
        const peer = getPeerConnection();
        if (!peer) throw new Error("Peer connection not initialized");

        await peer.setRemoteDescription(new RTCSessionDescription(answer));

        const candidates = pendingRemoteCandidatesRef.current.splice(0);
        for (const candidate of candidates) {
          await peer.addIceCandidate(new RTCIceCandidate(candidate));
        }

        flushLocalCandidates();
        setConnectionState("connected");
      } catch (error) {
        console.error("Error handling answer:", error);
      }
    },
    [flushLocalCandidates]
  );

  const handleIceCandidate = useCallback(async ({ candidate }) => {
    try {
      const peer = getPeerConnection();
      if (!peer) return;

      if (!peer.remoteDescription) {
        pendingRemoteCandidatesRef.current.push(candidate);
        return;
      }

      await peer.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.error("Error adding ICE candidate:", error);
    }
  }, []);

  const handleConnect = async () => {
    try {
      setConnectionState("connecting");
      const peer = await ensureMedia();
      if (!peer) return;

      if (peer.signalingState !== "stable") {
        console.warn("Peer is already negotiating");
        return;
      }

      const offer = await createOffer();
      getSocket()?.emit("offer", {
        interviewId,
        offer,
      });
    } catch (error) {
      console.error("Could not start video connection:", error);
      setConnectionState("failed");
    }
  };

  const toggleMic = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const toggleCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
      }
    }
  };

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);

    const startCamera = async () => {
      try {
        await ensureMedia();
      } catch (error) {
        console.warn("Camera start warning:", error);
      }
    };

    startCamera();

    return () => {
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice-candidate", handleIceCandidate);

      pendingLocalCandidatesRef.current = [];
      pendingRemoteCandidatesRef.current = [];
      remoteSocketIdRef.current = null;

      closePeerConnection();
    };
  }, [ensureMedia, handleOffer, handleAnswer, handleIceCandidate]);

  const stateColors = {
    connected: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    connecting: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    failed: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    idle: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };

  return (
    <div className="flex flex-col h-full bg-[#131313] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-4 py-3 bg-[#1a1919] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
            <FiVideo className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Live Video Call</h3>
            <p className="text-[11px] text-gray-400">Peer-to-Peer WebRTC</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex items-center space-x-1 ${
              stateColors[connectionState] || stateColors.idle
            }`}
          >
            <FiWifi className="mr-1" />
            {connectionState}
          </span>
          <button
            onClick={handleConnect}
            className="text-xs bg-neon-gradient hover:opacity-90 text-white px-3 py-1.5 rounded-lg font-medium transition-all shadow-[0_0_16px_rgba(46,91,255,0.25)] flex items-center space-x-1 cursor-pointer"
          >
            <FiPhoneCall className="w-3 h-3" />
            <span>Connect</span>
          </button>
        </div>
      </div>

      {/* Video Tiles Grid */}
      <div className="flex-1 p-3 grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-[200px]">
        {/* Local Participant Tile */}
        <div className="relative rounded-xl overflow-hidden bg-[#0e0e0e] border border-white/10 flex items-center justify-center aspect-video sm:aspect-auto">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${!isCameraOn ? 'hidden' : ''}`}
          />
          {!isCameraOn && (
            <div className="flex flex-col items-center justify-center text-gray-500">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 mb-1">
                <FiUser className="w-6 h-6" />
              </div>
              <span className="text-xs">Camera is Off</span>
            </div>
          )}

          {/* Overlay Tag */}
          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur text-[11px] text-white flex items-center space-x-1.5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>You</span>
          </div>

          {/* Quick tile controls */}
          <div className="absolute bottom-2 right-2 flex items-center space-x-1.5">
            <button
              onClick={toggleMic}
              className={`p-1.5 rounded-md border text-xs transition-colors cursor-pointer ${
                isMicOn
                  ? 'bg-black/60 text-white border-white/10 hover:bg-black/80'
                  : 'bg-rose-500/80 text-white border-rose-500'
              }`}
            >
              {isMicOn ? <FiMic className="w-3.5 h-3.5" /> : <FiMicOff className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={toggleCamera}
              className={`p-1.5 rounded-md border text-xs transition-colors cursor-pointer ${
                isCameraOn
                  ? 'bg-black/60 text-white border-white/10 hover:bg-black/80'
                  : 'bg-rose-500/80 text-white border-rose-500'
              }`}
            >
              {isCameraOn ? <FiVideo className="w-3.5 h-3.5" /> : <FiVideoOff className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Remote Participant Tile */}
        <div className="relative rounded-xl overflow-hidden bg-[#0e0e0e] border border-white/10 flex items-center justify-center aspect-video sm:aspect-auto">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className={`w-full h-full object-cover ${!hasRemoteVideo ? 'hidden' : ''}`}
          />
          {!hasRemoteVideo && (
            <div className="flex flex-col items-center justify-center text-gray-500 text-center p-4">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 mb-2">
                <FiUser className="w-6 h-6" />
              </div>
              <span className="text-xs text-gray-400 font-medium">Waiting for participant...</span>
              <span className="text-[10px] text-gray-600 mt-0.5">
                Click &quot;Connect&quot; above to initiate WebRTC call
              </span>
            </div>
          )}

          {/* Overlay Tag */}
          <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur text-[11px] text-white flex items-center space-x-1.5 border border-white/10">
            <span
              className={`w-2 h-2 rounded-full ${
                hasRemoteVideo ? 'bg-emerald-400' : 'bg-gray-500'
              }`}
            ></span>
            <span>Remote Participant</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPanel;
