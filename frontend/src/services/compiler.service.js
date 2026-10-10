const API = "http://localhost:3000/api/compiler";
const SUBMISSION_API = "http://localhost:3000/api/submission";

export const runCode = async (data) => {
    const response = await fetch(`${API}/execute`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Compiler Error");
    }
    return result;
};

export const runTestCases = async (data) => {
    const response = await fetch(`${API}/test`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Test Execution Error");
    }
    return result;
};

export const submitSolution = async (data) => {
    const response = await fetch(`${SUBMISSION_API}/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Submission Error");
    }
    return result;
};

export const getInterviewSubmissions = async (interviewId) => {
    const response = await fetch(`${SUBMISSION_API}/interview/${interviewId}`, {
        method: "GET",
        credentials: "include"
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || "Failed to get submissions");
    }
    return result;
};
