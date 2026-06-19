export const createInterview = async (
    interviewData
) => {
    const response= await fetch(
        "http://localhost:3000/api/interview/create",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            credentials:'include',
            body:JSON.stringify(interviewData)
        }
    )
    const data= await response.json()
    console.log(data);
    return data
}