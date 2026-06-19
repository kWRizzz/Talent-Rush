import React, { useEffect, useState } from 'react'
import {
    createInterview
} from "../../services/interview.service";


const CreateInterview = () => {
    const [title, setTitle] = useState("")
    const [scheduledAt, setScheduledAt] = useState("");
    const [candidate, setCandidate] = useState("");

    const submitHandler = async (
        e
    ) => {
        e.preventDefault();
        try {
            const data = await createInterview({
                title,
                candidate,
                scheduledAt
            })

            console.log(data)
        } catch (error) {
            console.log(" frontent mein create nahi ho rha hai " + error);
        }
    }

    return (
        <div>

            <form onSubmit={submitHandler}>

                <input
                    type="text"
                    placeholder='tetle de '
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Candidate Id"
                    value={candidate}
                    onChange={(e) =>
                        setCandidate(e.target.value)
                    }
                />
                <input
                    type="date"
                    value={scheduledAt}
                    onChange={(e) =>
                        setScheduledAt(e.target.value)
                    }
                />
                <button
                    type='submit'
                >
                            Create Interview

                </button>
            </form>
        </div>
    )
}

export default CreateInterview