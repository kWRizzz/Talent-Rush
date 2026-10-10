const API = "http://localhost:3000/api/question";

export const fetchLeetCodeQuestion = async (number) => {
    const response = await fetch(`${API}/leetcode/${number}`, {
        method: "GET",
        credentials: "include"
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch LeetCode question");
    }
    return data;
};

export const fetchCuratedLeetCodeList = async () => {
    const response = await fetch(`${API}/leetcode/curated`, {
        method: "GET",
        credentials: "include"
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch curated questions");
    }
    return data;
};

export const addLeetCodeToInterview = async (interviewId, questionNumber) => {
    const response = await fetch(`${API}/leetcode/add-to-interview`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ interviewId, questionNumber })
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to add LeetCode question to interview");
    }
    return data;
};

export const createQuestion = async (questionData) => {
    const response = await fetch(`${API}/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(questionData)
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to create question");
    }
    return data;
};

export const getQuestionById = async (id) => {
    const response = await fetch(`${API}/${id}`, {
        method: "GET",
        credentials: "include"
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch question");
    }
    return data;
};
