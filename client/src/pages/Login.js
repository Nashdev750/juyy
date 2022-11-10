import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import axios from 'axios';
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { URL } from '../api/api'

const Login = ({setAuth})=>{
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data=>{
       axios.post(URL+'login',data)
       .then(resp=>{
            if(resp.data?.error){
                toast.error(resp.data?.error)
                console.log(resp.data?.error)
            }
            if(resp.data?.user){
                window.localStorage.setItem('token', resp.data?.token)
                window.localStorage.setItem('user', JSON.stringify(resp.data?.token))
                setAuth(true)
            }
       })
    }
    return (
        <div className="login">
            <ToastContainer
                position="top-right"
                autoClose={5000}
            />
            <div className="login-form">
                <h1>Login</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="text" placeholder="@"
                    style = {{border:`${errors.username?'1px solid tomato':''}`}}
                    {...register("username", { required: true })}
                    />
                    <input type="password" placeholder="Password"
                    style = {{border:`${errors.username?'1px solid tomato':''}`}}
                    {...register("password", { required: true })}
                    />
                    <button><ArrowCircleRightIcon style={{color:'white'}}/></button>
                </form>
            </div>
        </div>
    )
}

export default Login