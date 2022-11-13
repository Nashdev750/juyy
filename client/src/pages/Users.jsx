import Container from "react-bootstrap/esm/Container"
import Row from "react-bootstrap/esm/Row"
import Col from 'react-bootstrap/Col';
import AddIcon from '@mui/icons-material/Add';
import { Drawer,Button } from "@mui/material";
import { useEffect, useState } from "react";
import AddUser from "./AddUser";
import CloseIcon from '@mui/icons-material/Close';
import { Link } from "react-router-dom";
import { getData } from '../api/api'
import NavBar  from "../components/NavBar";
import { format } from 'date-fns'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';

const Users = ()=>{
    const [open, setOpen] = useState(false)
    const [backusers,setBackusers] = useState([])
    const [users,setUsers] = useState([])
    const [clients,setClients] = useState([])
    const [searchkey, setSearchkey] = useState('')


    const getUsers = ()=>{
        getData('users')
        .then(res=>{
            if(res.data?.error){
                setUsers([])
            }else{
                setUsers(res.data)
                setBackusers(res.data)
            }
        })
    }
    useEffect(()=>{
        getUsers()
        getData('customer/all')
        .then(res=>{
           if(!res.data?.error) setClients(res.data)
        })
    },[])
    const search = (ky)=>{
        if(ky == '') return setUsers(backusers)
        let clients = [...backusers]
        let data = clients.filter(item =>(
            item.clientName?.toLowerCase().includes(ky.toLowerCase()) ||
            item.phone?.toLowerCase().includes(ky.toLowerCase()) ||
            item.clientID?.toLowerCase().includes(ky.toLowerCase()) ||
            item.clientid9?.toLowerCase().includes(ky.toLowerCase()) ||
            item.notes?.toLowerCase().includes(ky.toLowerCase()) ||
            item.residence?.toLowerCase().includes(ky.toLowerCase())
            ))
        setUsers(data)    
    }
    useEffect(()=>{
        search(searchkey)
    },[searchkey])
    return  (
        <Container fluid>
            <Row>
                <NavBar/>
            </Row>
            <Row>
                 <Col  xs = {12}>
                    <div className="input">
                    <input type="text" placeholder="Search" onChange={e=>setSearchkey(e.target.value)} />
                    </div>
                 </Col>
                 <Col  xs = {12}>
                    <div className="filter">
                        <FilterAltOutlinedIcon/>
                        <select>
                            <option>User Client</option>
                            {clients.map((itm,i)=>(
                                <option key={i} value={itm._id}>{itm.username}</option>
                            ))}
                        </select>
                        <select>
                            <option>Process Status</option>
                            <option value="canceled" style={{background:"#EB0C0C"}}>Canceled</option>
                            <option value="success" style={{background:"#4ECB71"}}>Success</option>
                            <option value="signed" style={{background:"#85B6FF"}}>Signed</option>
                            <option value="approved" style={{background:"#FFD233"}}>Approved</option>
                            <option value="fail" style={{background:"#FF9790"}}>Fail</option>
                            <option value="waiting" style={{background:"whitesmoke"}}>Waiting</option>
                        </select>
                        <input  type="date" placeholder="calender"/>
                    </div>
                 </Col>
                 
            </Row>
            <Row>
                 <Col  xs = {12}>
                    <div className="addnew" onClick={()=>setOpen(true)}>
                       <div style={{border:'1px solid white'}}><AddIcon style={{color:'#00000050'}}/></div>
                   </div>
                 </Col>
            </Row>
            <Row>
                {users.map((user,i)=>(
                    <Link
                    key={i} 
                     style={{textDecoration:'none'}}
                    to={'/user/'+user._id}>
                    <Col  xs = {12}>
                  <div className="user">
                    <div>
                    <div className="info">
                       <span className="bold">{user.clientName}</span>
                       <span className="bold">{user.clientID} </span>
                    </div>
                    <div className={`state ${user.status}`}>
                       {user.status} status
                    </div>
                    </div>
                    <div className="details">
                        <div>
                        <span className="normal">User Client</span>
                       <span className="normal">Date: {user?.createdAt?format(new Date(user?.createdAt), 'dd/MM/yyyy'):'-'}</span>
                        </div>
                        <div>
                        <span className="normal">Approved date: {user?.approvalDate?format(new Date(user?.approvalDate), 'dd/MM/yyyy'):'-'}</span>
                        </div>
                        <div>
                        <span className="normal">Canceled date: {user?.signedDate?format(new Date(user?.signedDate), 'dd/MM/yyyy'):'-'}</span>
                        </div>
                        <div>
                        <span className="normal">Sucess date: {user?.successDate?format(new Date(user?.successDate), 'dd/MM/yyyy'):'-'}</span>
                        </div>
                    </div>
                  </div>
                 </Col>
                 </Link>
                ))}
                 
            </Row>
            <Drawer
                anchor={'right'}
                open={open}
                onClose={()=>setOpen(false)}
                >
                <Button
                style = {{
                    width:'60px'
                }}
                 onClick = {()=>setOpen(false)}
                ><CloseIcon/></Button>    
                <AddUser getUsers={getUsers}/>
            </Drawer>
        </Container>
    )
}

export default Users