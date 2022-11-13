import axios from 'axios'
export const URI = 'https://mothetindung247.one/api/'

const config = ()=>{
    return {
        headers:{
            authorization: 'Bearer '+window.localStorage.getItem('token')
        }
    }
}

export const postData = (end,data)=> (axios.post(URI+end,data,config()))
export const getData = (end)=> (axios.get(URI+end,config()))
