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

export const getMyInterviews = async () => {
    try {
        const respons= await fetch(
            "http://localhost:3000/api/interview/my",
            {
                credentials:'include'
            }
        )

        const data= await respons.json()
        console.log(data)
        
        return data

        } catch (error) {
        console.log("get my int nahi chala " + error);
        
    }
}

export const getInterviewById = async (
    interviewData,
    id
) => {
    try {
        const respons= await fetch(
            `http://localhost:3000/api/interview/:${id}`,
            {
                credentials:"include"
            }
        )

        const data= respons.json()
        console.log(data);
        return data
    } catch (error) {
        console.log(`error while fetching interview by id ${error}`);
    }
}


export const deleteInterview = async (
    id
) => {
    try {
        const respons= await fetch(
            `http://localhost:3000/api/interview/:${id}`,
            {
                method:"DELETE",
                credentials:"include"
            }
        )

        const data= respons.json()
        console.log(data);
        return data;
    } catch (error) {
        console.log(`error in deleting your interview room ${error}`)
    }
}