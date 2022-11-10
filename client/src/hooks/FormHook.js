import { useState } from "react"

const useFormHook = ()=>{
     const [formdata,setFormdata] = useState({})
     const [errors,setErrors] = useState({})

     const setValue = (key,value)=>{
       if(value){
        setFormdata(data=>{
            let fdata = data
            fdata[key]=value
            return fdata
        })
         setErrors(error=>{
            delete error[key]
            return error
         })
       }else{
        setErrors(data=>{
            let err = data
            err[key]= key+" is required"
            return err
        })
       }
     }
     
     const handleSubmit = ()=>{
        
      return formdata
     }

     const register = (key)=>{
        setErrors(data=>{
            let err = data
            err[key]= key+" is required"
            return err
        })
        setFormdata(data=>{
            let fdata = data
            fdata[key]=''
            return fdata
        })
     }

    return {
        handleSubmit,
        errors,
        formdata,
        setValue,
        register

    }
}


export default useFormHook