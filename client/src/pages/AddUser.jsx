import { useEffect, useState } from "react"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import { useForm } from "react-hook-form";
import SaveIcon from '@mui/icons-material/Save';
import { URI,getData, postData } from '../api/api'
import { toast,ToastContainer } from "react-toastify";

const AddUser = ({getUsers})=>{
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [users,setUsers] = useState([])
    const user = JSON.parse(window.localStorage.getItem('user'))

    useEffect(()=>{
       if(user?.role == 'admin'){
        getData('customer/all')
        .then(res=>{
           if(!res.data?.error) setUsers(res.data)
        })
       }
    },[])


    const onSubmit = data => {
        const formdata = new FormData()
        formdata.append('files', data.front[0])
        formdata.append('files', data.back[0])
        for(let i = 0; i < data.files.length; i++) {
           formdata.append('files', data.files[i])
        }
        if(data?.user) {
           let c = users[Number(data.user)]
           data.userid = c._id
           data.user = JSON.stringify(c)
        }else{
           data.userid = user._id
           data.user = JSON.stringify(user)     
        }
        Object.keys(data).map(ky=>{
                if(ky !=='front' && ky !=='back' && ky !=='files'){
                  formdata.append(ky,data[ky])
                }
        })
       postData('adduser',formdata)
       .then(res=>{
        if(res.data.error) return toast.error(res.data.error)
        if(res.data?._id){
                setUsers(prv=>{
                        return [...prv,res.data]
                })
                toast.success("User added successfully")
        }else{
                toast.error("Unknown error")       
        }
       }).catch(err=>{
        toast.error("Unknown error") 
    })

    };
    const [front,setFront] = useState()
    const [back,setBack] = useState()

    return (
        <div className="side">
               <ToastContainer/>
            <form onSubmit={handleSubmit(onSubmit)} className="form" encType="multipart/form-data">
            <div className="files">
               <div className="front">
                 <label htmlFor="front"
                  style={{border:`${errors.front?'1px solid tomato':''}`}}
                 >
                    <div>  <AddIcon style={{color:front?'white':'#00000050'}}/></div>
                    <img src={front} alt="" style={{display:front?'flex':'none'}}/>
                 </label>
                 <input type="file" id="front" 
                 {...register("front", { required: true, onChange:(e)=>setFront(URL.createObjectURL(e.target.files[0])) })}
                 />
               </div>
               <div className="back">
                 <label htmlFor="back"
                  style={{border:`${errors.back?'1px solid tomato':''}`}}
                 >
                    <div>  <AddIcon style={{color:back?'white':'#00000050'}}/></div>
                    <img src={back} alt="" style={{display:back?'flex':'none'}}/>
                 </label>
                 <input type="file" id="back" 
                  {...register("back", { required: true, onChange:(e)=>setBack(URL.createObjectURL(e.target.files[0])) })}
                 />
               </div>
            </div>
              {user?.role == 'admin' &&
                <div className="input">
                        <select
                        style={{border:`${errors.user?'1px solid tomato':''}`}}
                        {...register("user", { required: false })}>
                                <option value="">Select Users Client</option>
                                {users.map((user,i)=>(
                                   <option key={i} value={i}>{user.username}</option>
                                ))}
                        </select>
                </div>
              }
            <div className="input">
                    <input
                      style={{border:`${errors.clientID?'1px solid tomato':''}`}}
                     type="number"  {...register("clientID", { required: true })} placeholder="Client ID" />
            </div>
            <div className="input">
                    <input
                     style={{border:`${errors.clientName?'1px solid tomato':''}`}}
                    {...register("clientName", { required: true })}
                    type="text" placeholder="Client Name" />
            </div>
            <div className="input">
                    <input
                     style={{border:`${errors.dob?'1px solid tomato':''}`}}
                     type="date" placeholder="Date of Birth" 
                     {...register("dob", { required: true })}
                    />
            </div>
            <div className="input">
                    <select 
                     style={{border:`${errors.sex?'1px solid tomato':''}`}}
                     {...register("sex", { required: true })}
                    >
                        <option value="">Sex</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
            </div>
            <div className="input">
                    <input type="text" placeholder="Place of Residence"
                     style={{border:`${errors.residence?'1px solid tomato':''}`}} 
                     {...register("residence", { required: true })}
                    />
            </div>
            <div className="input">
                    <input type="date" placeholder="ID Issue Date"
                     style={{border:`${errors.issueDate?'1px solid tomato':''}`}}
                    {...register("issueDate", { required: true })}
                    />
            </div>
            <div className="input">
                    <input type="number" placeholder="Phone Number"
                     style={{border:`${errors.phone?'1px solid tomato':''}`}}
                     {...register("phone", { required: true })}
                    />
            </div>
            <div className="input">
                    <input type="number" placeholder="Client ID"
                     style={{border:`${errors.clientid9?'1px solid tomato':''}`}}
                     {...register("clientid9", { required: false })}
                    />
            </div>
            <div className="input">
                    <textarea cols="30" rows="5"
                     style={{border:`${errors.notes?'1px solid tomato':''}`}}
                     {...register("notes", { required: true })}
                    ></textarea>
            </div>
            <div className="input other">
                    <label htmlFor="otherfiles">
                    <CloudUploadIcon/>
                    </label>
                    <input type="file" accept="*/" id="otherfiles"
                     {...register("files", { required: false })}
                    multiple />
            </div>
            <div className="input other">
                    <label htmlFor="sub" style={{background:'#B3B3B3'}}>
                    <SaveIcon style={{color:'white'}}/>
                    </label>
                    <input type="submit" accept="*/" id="sub" required />
            </div>
           </form>
           
        </div>
    )
}

export default AddUser