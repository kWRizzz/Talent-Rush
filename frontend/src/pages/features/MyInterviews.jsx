import React, { useEffect, useState } from 'react'
import {
    getMyInterviews
} from "../../services/interview.service"
import {
    Navigate,
    useNavigate
} from "react-router-dom"

const MyInterviews = () => {
    const [interviews, setInterviews] = useState([])
    const navigate = useNavigate()

    const fetchInterviews = async () => {
        try {
            const data = await getMyInterviews();
            console.log(data)
            setInterviews(data)
        } catch (error) {
            console.log("cant get your interview nigga " + error);
        }
    }

    useEffect(() => {
        fetchInterviews()
    }, [])


    return (
        <div>
            <h1>
                My Interview
            </h1>
            {
                interviews.length === 0 ? (
                    <p>No interview baby</p>
                ) : (
                    interviews.map((interview) => (
                        <div
                            key={interview._id}
                            style={{
                                border: "1px solid gray",
                                padding: "10px",
                                marginBottom: "10px",
                            }}
                        >
                            <h2>{interview.title}</h2>

                            <p>
                                Room ID: {interview.roomId}
                            </p>

                            <p>
                                Status: {interview.status}
                            </p>

                            <button
                                onClick={() =>
                                    navigate(
                                        `/interview/${interview.roomId}`
                                    )
                                }
                            >
                                Join Interview
                            </button>
                        </div>
                    ))
                )
            }
        </div>
    )
}

export default MyInterviews