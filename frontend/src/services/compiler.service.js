const API = "http://localhost:3000/api/compiler";

export const runCode = async (
    data
) => {

    const response = await fetch(`${API}/run`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data)
    })

    const result = await response.json()

    if (!response.ok) {
        throw new Error(result.message || "Compiler Error");
    }
    return result;
}

