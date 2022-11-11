import Container from "react-bootstrap/esm/Container"
import Row from "react-bootstrap/esm/Row"
import Col from 'react-bootstrap/Col';
import AddIcon from '@mui/icons-material/Add';
import { Drawer,Button } from "@mui/material";
import { useEffect, useState } from "react";
import AddUser from "./AddUser";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import { Link } from "react-router-dom";
import { URI } from '../api/api'

const Users = ()=>{
    const [open, setOpen] = useState(false)
    const [users,setusers] = useState([])

    useEffect(()=>{
        axios.get(URI+'users')
        .then(res=>{
            setusers(res.data)
        })
    },[])
    return  (
        <Container fluid>
            <Row>
                 <Col  xs = {12}>
                    <div className="input">
                    <input type="text" placeholder="Search" />
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
                     style={{textDecoration:'none'}}
                    to={'/user/'+user._id}>
                    <Col  xs = {12}>
                  <div className="user">
                    <div>
                    <div className="info">
                       <span className="bold">{user.clientName}</span>
                       <span className="bold">{user.clientID} </span>
                    </div>
                    <div className="status failed">
                        Processing status
                    </div>
                    </div>
                    <div className="details">
                        <div>
                        <span className="normal">User Client</span>
                       <span className="normal">Date: {user.createdAt}</span>
                        </div>
                        <div>
                        <span className="normal">Approved date: {user.approvalDate}</span>
                        </div>
                        <div>
                        <span className="normal">Canceled date: {user.signedDate}</span>
                        </div>
                        <div>
                        <span className="normal">Sucess date: {user.successDate}</span>
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
                <AddUser/>
            </Drawer>
        </Container>
    )
}

export default Users