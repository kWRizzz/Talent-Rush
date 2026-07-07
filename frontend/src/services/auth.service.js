const API = "http://localhost:3000/api/user";

export const register= async (userData) => {
    
    const response= await fetch(`${API}/register`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        credentials:"include",
        body:JSON.stringify(userData)
    })

    const data= response.json()
    return data
}

export const login =async (userData) => {
    const response= await fetch(`http://localhost:3000/api/user/login`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        credentials:"include",
        body:JSON.stringify(userData)
    })
    const data= response.json()
    return data
}

export const logout= async () => {
    const response= await fetch(`${API}/logout`,{
        method:"GET",
        
        credentials:"include",

    })

    const data= response.json();
    return data
}

export const getUser= async () => {
    const response = await fetch(`${API}/my`,{
        method:"GET",
        credentials:"include"
    })
    const data = await response.json()
    return data
}