import React from "react";
import { useParams } from "react-router-dom";

const InterviewRoom = () => {

  const { roomId } = useParams();

  return (
    <div>

      <h1>Interview Room</h1>

      <p>
        Room Id : {roomId}
      </p>

    </div>
  );
};

export default InterviewRoom;