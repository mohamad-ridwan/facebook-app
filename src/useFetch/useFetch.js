import { API_ENDPOINT_LOCAL, TOKEN_SECRET_APP } from "../api"

async function useFetch(path, method, data){
    return await new Promise((resolve, reject)=>{
        fetch(`${API_ENDPOINT_LOCAL}/${path}`, {
            method: method,
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${TOKEN_SECRET_APP}`
            },
            body: JSON.stringify(data)
        })
        .then(res=>res.json())
        .then(res=>resolve(res))
        .catch(err=>reject(err))
    })
}

export default useFetch