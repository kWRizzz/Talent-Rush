import React, { useEffect, useRef } from 'react'

import {
  useSelector
} from "react-redux"


import {
  getLocalStream,
  addLocalTrack,
  createoffer,
  createAnswer
} from "../../services/webrtc.service"
import { getSocket } from '../../services/socket.service'

const VideoPanel = ({ interviewId }) => {

  const handleOffer = async ({ offer, senderId }) => {
    try {
      const offer = await createoffer();
      const socket = getSocket();
      const answer = await createAnswer(offer);

      socket.emit("answer", {
        interviewId,
        answer,
        targetId: senderId
      })

    } catch (error) {
      console.log(
        "acnt start offer "
        + error
      )
    }
  }

  useEffect(() => {
    const socket = getSocket();
    socket.on("offer",handleOffer);
    return()=>{
      socket.off("offer",handleOffer);
    }
  }, [interviewId])


  const videoRef = useRef(null);

  useEffect(() => {

    const startCamera = async () => {
      try {
        const stream = await getLocalStream();
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        await addLocalTrack();
      } catch (error) {
        console.log("error in camera" + error);
      }
    }
    startCamera()
  }, [])


  return (

    <div className="border rounded p-2">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full"
      />
      <button
        onClick={handleOffer}
        className="border px-3 py-2 rounded mt-2"
      >
        connect
      </button>
    </div>
  )
}

export default VideoPanel