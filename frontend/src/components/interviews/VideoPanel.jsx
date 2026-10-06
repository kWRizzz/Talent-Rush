import React, { useEffect, useRef } from 'react'

import {
  useSelector
} from "react-redux"


import {
  getLocalStream,
  addLocalTrack,
  createoffer
} from "../../services/webrtc.service"
import { getSocket } from '../../services/socket.service'

const VideoPanel = ({ interviewId }) => {

  const handleOffer = async () => {
    try {
      const offer = await createoffer();
      const socket = getSocket();

      socket.emit("offer", {
        interviewId,
        offer
      })
    } catch (error) {
      console.log(
        "acnt start offer "
        + error
      )
    }
  }

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