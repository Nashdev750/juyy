import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from '@mui/icons-material/Edit';
import { Link, useParams } from "react-router-dom"
import { Container, Row,Col } from "react-bootstrap"
import { useEffect, useState } from 'react';
import { compareAsc, format } from 'date-fns'
import { getData} from '../api/api'
import copy from 'copy-text-to-clipboard';
import { Drawer,Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditUser from './EditUser';

const View = ()=>{
    const [user,setuser] = useState({})
    const [open,setOpen] = useState(false)
    const {id} = useParams()
    const getUser = ()=>{
        getData('user/'+id)
        .then(res=>{
            setuser(res.data)
        })
    }
    useEffect(()=>{
        getUser()
    },[])
    const deleteuser = ()=>{
        let ok = window.confirm('Delete '+user?.clientName+' ?')
        if(ok){
            getData('user/delete/'+user?._id)
            .then(res=>{
              setuser({})
              alert('User deleted!')
            })
            .catch(err=>alert('Unable to delete user'))
        }
    }
    const user2 = JSON.parse(window.localStorage.getItem('user'))
    return (
        <Container fluid>
            <Row style={{
                display:'flex',
                justifyContent:'space-between'
            }}>
                <Link to='/' style={{width:'fit-content'}}><ArrowBackIosIcon/></Link>
                {user.role == 'admin' &&
                  <a href={user2?.files} target="_blank" style={{width:'fit-content'}}>Folder Access</a>
                }
            </Row>
            <Row style={{padding:'15px'}}>
                <span className={`state ${user?.status}`}>{user?.status} status</span>
            </Row>
            <Row style={{padding:'7px'}}>
                <Col sx={12}>
                 <div className="atrr">
                 <span>Code</span>
                 <span>{user?.code? user?.code:'-'}</span>
                 </div>
                </Col>
            </Row>
            <Row style={{padding:'7px'}}>
                <Col sx={12}>
                 <div className="atrr">
                 <span>Waiting date:</span>
                 <span>{user?.createdAt?format(new Date(user?.createdAt), 'dd/MM/yyyy'):'-'}</span>
                 </div>
                </Col>
            </Row>
            <Row style={{padding:'7px'}}>
                <Col sx={12}>
                <div className="atrr">
                <span>Approved date:</span>
                <span>{user?.approvalDate?format(new Date(user?.approvalDate), 'dd/MM/yyyy'):'-'}</span>
                </div>
                </Col>
            </Row>

            <Row style={{padding:'7px'}}>
                <Col sx={12}>
                <div className="atrr">
                <span>Signed date:</span>
                <span>{user?.signedDate?format(new Date(user?.signedDate), 'dd/MM/yyyy'):'-'}</span>
                </div>
                </Col>
            </Row>

            <Row style={{padding:'7px'}}>
                <Col sx={12}>
                <div className="atrr">
                <span>Sucess date:</span>
                <span>{user?.successDate?format(new Date(user?.successDate), 'dd/MM/yyyy'):'-'}</span>
                </div>
                </Col>
            </Row>

            <Row style={{padding:'7px'}}>
                <Col sx={12}>
                <div className="atrr">
                <span>User client:</span>
                <span>{user?.user?JSON.parse(user?.user)?.username:'-'}</span>
                </div>
                </Col>
            </Row>

            <Row style={{padding:'7px'}}>
                <Col sx={12}>
                <div className="atrr">
                <span>Customer name:</span>
                <span>{user?.clientName}</span>
                </div>
                </Col>
            </Row>

            <Row style={{padding:'7px'}}>
                <Col sx={12}>
                <div className="atrr">
                <span>ID 12 numbers:</span>
                <span>{user?.clientID}</span>
                </div>
                </Col>
            </Row>

            <Row style={{padding:'7px'}}>
                <Col sx={12}>
                <div className="atrr">
                <span>Date of birth:</span>
                <span>{user?.dob?format(new Date(user?.dob), 'dd/MM/yyyy'):'-'}</span>
                </div>
                </Col>
            </Row>

            <Row style={{padding:'7px'}}>
                <Col sx={12}>
                <div className="atrr">
                <span>Sex:</span>
                <span>{user?.sex}</span>
                </div>
                </Col>
            </Row>

            <Row style={{padding:'7px'}}>
                <Col sx={12}>
                <div className="atrr">
                <span>Place of residence:</span>
                <span>{user?.residence}</span>
                </div>
                </Col>
            </Row>

            <Row style={{padding:'7px'}}>
                <Col sx={12}>
                <div className="atrr">
                <span>ID issue date :</span>
                <span>{user?.issueDate?format(new Date(user?.issueDate), 'dd/MM/yyyy'):'-'}</span>
                </div>
                </Col>
            </Row>

            <Row style={{padding:'7px'}}>
                <Col sx={12}>
                <div className="atrr">
                <span>ID Card 9 numbers:</span>
                <span>{user?.clientid9}</span>
                </div>
                </Col>
            </Row>

            <Row style={{padding:'7px'}}>
                <Col sx={12}>
                <div className="atrr">
                <span>Phone number:</span>
                <span>{user?.phone}</span>
                </div>
                </Col>
            </Row>

            <Row style={{padding:'7px'}}>
                <Col sx={12}>
                <div className="atrr">
                <span>Note:</span>
                <span>{user?.notes}</span>
                </div>
                </Col>
            </Row>
            {user2.role == 'admin' && 
              <Row id="row" style={{display:'flex',justifyContent:'space-between'}}>
              <div>
                 <button className='button' onClick = {()=>setOpen(true)}>
                 <EditIcon/></button>
                 <button className='button left' onClick={()=>{
                   if(copy(`${user?.clientID}|${user?.clientid9}|${user?.clientName}|${user?.phone}`)){
                      alert('Copied to clipboard')
                   }
                 }}><ContentCopyIcon/></button>
              </div>
              <div>
                  <button className='button' onClick={deleteuser}><RemoveIcon/></button>
              </div>
          </Row>
            }
            {/* edit user drawer */}
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
                <EditUser getUser = {getUser} customer = {user}/>
            </Drawer>
        </Container>
    )
}

export default View