import { CircularProgress } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"
import {URL} from '../api/api'
import Login from '../pages/Login'

const Layout = ({children})=>{
    const [auth,setAuth] = useState(false)
    const [loading,setLoading] = useState(true)
    
    useEffect(()=>{
       let token  = window.localStorage.getItem('token')
       axios.get(URL, {
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      }).then(res=>{
        if(res.data?.success === true){
            setAuth(true)
        }
        setLoading(false)
      }).catch(err=>{
        setLoading(false)
      })
    },[])

  return (
      loading
      ?<div className="loading"> <CircularProgress/></div>
      :(auth
        ?children
        :<Login setAuth={setAuth}/>
        )
  )
}

export default Layout