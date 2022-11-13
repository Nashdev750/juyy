import axios from 'axios'
export const URI = 'http://localhost:8000/api/'

const config = ()=>{
    return {
        headers:{
            authorization: 'Bearer '+window.localStorage.getItem('token')
        }
    }
}

export const postData = (end,data)=> (axios.post(URI+end,data,config()))
export const getData = (end)=> (axios.get(URI+end,config()))
