import { Container,Row } from "react-bootstrap"
import NavBar from "../components/NavBar"
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import RemoveIcon from '@mui/icons-material/Remove';
import { Drawer,Button } from '@mui/material';
import { getData, postData } from "../api/api";
import CloseIcon from '@mui/icons-material/Close';
import { useForm } from "react-hook-form";
import SaveIcon from '@mui/icons-material/Save';
import Col from 'react-bootstrap/Col';
import AddIcon from '@mui/icons-material/Add';
import { toast,ToastContainer } from "react-toastify";
import { Lock } from "@mui/icons-material";


const Account = ()=>{
    const { register, handleSubmit,setValue, formState: { errors } } = useForm();
    const [clients,setClients] = useState([])
    const [clients2,setClients2] = useState([])
    const [open,setOpen] = useState(false)
    const [edit,setEdit] = useState(false)
    const [id,setId] = useState()
    const [val,setVal] = useState('')
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const user = JSON.parse(window.localStorage.getItem('user'))
    console.log(user)
    const handleChangeRowsPerPage = (p) => {
        setRowsPerPage(p);
      };
      const getusers = ()=>{
            getData('accounts/all')
            .then(res=>{
            if(!res.data?.error){
                setClients(res.data)
                setClients2(res.data)
            } 
            })
        }
      useEffect(()=>{
        getusers()
    },[])
    const edituser = (user) =>{
        setEdit(true)
        setId(user._id)
        setValue('username',user.username)
        setValue('role',user.role)
        setValue('password','')
        setOpen(true)
    }
   const columns = [
        {
            field: 'username',
            headerName: "@",
            type:String
        },
        {
            field: 'role',
            headerName: "Role",
            type:String
        },
        {
            field: '_id',
            headerName: 'ChangePass',
            sortable: false,
            renderCell: (cellValues) => {
                return <Button onClick = {()=>edituser(cellValues.row)}><Lock/></Button>;
              },
          },
        {
            field: '',
            headerName: 'Delete',
            sortable: false,
            renderCell: (cellValues) => {
                return <Button onClick = {()=>deleteuser(cellValues.row._id)}><RemoveIcon/></Button>;
              },
          }
    ]
    const onSubmit = data => {
        let end = 'customer/create'
        if(edit){
            if(!data?.password && !data?.username && !data?.role) return toast.error("Atleast one field is required")
            end = 'customer/edit/'+id
        }
        postData(end,data)
        .then(res=>{
            if(res.data.error) return toast.error(res.data.error)
            if(res.data._id){
                getusers()  
                toast.success('User added successfully')
            }
           
        })
        .catch(err=>{
            toast.error("Unknown error") 
        })
    }
    const deleteuser = (id)=>{
        if(!window.confirm('Are you sure you want to delete this user?')) return
        getData('accounts/delete/'+id)
        .then(res=>{
            if(res.data.error) return toast.error(res.data.error)
            if(res.data._id){
                getusers()  
                toast.success('User deleted!')
            }
        })
        .catch(err=>{
            console.log(err)
            toast.error("Unknown error") 
        })
    }
    // const search = ()=>{
    //     let data = [...clients2]
    //     let c = data.filter(u=>u.username.toLowerCase().includes(val.toLowerCase()))
    //     setClients(c)
    // }
    useEffect(()=>{
        if(val == "") return setClients(clients2)
        let data = [...clients2]
        let c = data.filter(u=>u.username.toLowerCase().includes(val.toLowerCase()))
        setClients(c)
    },[val])
    return (
        <Container fluid>
            <ToastContainer/>
          <Row>
            <NavBar/>
          </Row>
          <Row>
                 <Col  xs = {12}>
                    <div className="addnew" onClick={()=>setOpen(true)}>
                       <div style={{border:'1px solid white'}}><AddIcon style={{color:'#00000050'}}/></div>
                   </div>
                 </Col>
                 <Col  xs = {12}>
                  <div className="input" style={{marginTop:'10px'}}>
                    <input type='text'
                    onChange={(e)=>setVal(e.target.value)}
                    placeholder="Search..."
                    />
                  </div>
                 </Col>
            </Row>
          <Row>
          <DataGrid
            rows={clients}
            getRowId={(row) => row._id}
            columns={columns}
            pageSize={rowsPerPage}
            rowsPerPageOptions={[5,10,20,30,40,100]}
            autoHeight={true}
            disableSelectionOnClick
            onPageSizeChange={p=>handleChangeRowsPerPage(p)}
            experimentalFeatures={{ newEditingApi: true }}
             />
          </Row>
          <Drawer
                anchor={'right'}
                open={open}
                onClose={()=>{setOpen(false);setEdit(false)}}
                >
                <Button
                style = {{
                    width:'60px'
                }}
                 onClick = {()=>setOpen(false)}
                ><CloseIcon/></Button>    
                 <div className="adduser">
                    <h3>{edit?'Edit user':'Add User'}</h3><hr/>
                    <form onSubmit={handleSubmit(onSubmit)}>
                     {user.role=='admin' &&
                     <div className="input">
                     <select
                     style={{border:`${errors.role?'1px solid tomato':''}`}}
                     type="text"  {...register("role", { required: edit ? false : true })}
                     >
                        <option value="" selected>Role</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                     </select>
                  </div>
                     }  
                    <div className="input">
                     <input
                      style={{border:`${errors.username?'1px solid tomato':''}`}}
                     type="text"  {...register("username", { required: edit ? false : true })} placeholder="@" readOnly={edit} />
                    </div>
                    <div className="input">
                     <input
                      style={{border:`${errors.password?'1px solid tomato':''}`}}
                     type="password"  {...register("password", { required: edit ? false : true })} placeholder="Password" />
                    </div>
                    <div className="input other">
                    <label htmlFor="sub" style={{background:'#B3B3B3'}}>
                    <SaveIcon style={{color:'white'}}/>
                    </label>
                    <input type="submit"  id="sub" required />
            </div>
                    </form>
                 </div>
            </Drawer>
        </Container>
    )
}

export default Account