import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from '@mui/icons-material/Edit';
import { Link, useParams } from "react-router-dom"
import { Container, Row,Col } from "react-bootstrap"
import { useEffect, useState } from 'react';
import axios from "axios";

const View = ()=>{
    const [user,setuser] = useState({})
    const {id} = useParams()
    useEffect(()=>{
        axios.get('http://localhost:8000/api/user/'+id)
        .then(res=>{
            setuser(res.data)
        })
    },[])
    return (
        <Container fluid>
            <Row>
                <Link to='/'><ArrowBackIosIcon/></Link>
            </Row>
            <Row style={{padding:'7px'}}>
                <Col sx={12}>
                 <div className="atrr">
                 <span>Code</span>
                 <span>{user?.code? user?.code:''}</span>
                 </div>
                </Col>
            </Row>
            <Row style={{padding:'7px'}}>
                <Col sx={12}>
                 <div className="atrr">
                 <span>Waiting date:</span>
                 <span>{user?.createdAt}</span>
                 </div>
                </Col>
            </Row>
            <Row style={{padding:'7px'}}>
                <Col sx={12}>
                <div className="atrr">
                <span>Approved date:</span>
                <span>{user?.approvalDate}</span>
                </div>
                </Col>
            </Row>

            <Row style={{padding:'7px'}}>
                <Col sx={12}>
                <div className="atrr">
                <span>Signed date:</span>
                <span>{user?.signedDate}</span>
                </div>
                </Col>
            </Row>

            <Row style={{padding:'7px'}}>
                <Col sx={12}>
                <div className="atrr">
                <span>Sucess date:</span>
                <span>{user?.successDate}</span>
                </div>
                </Col>
            </Row>

            <Row style={{padding:'7px'}}>
                <Col sx={12}>
                <div className="atrr">
                <span>User client:</span>
                <span>{user?.clientName}</span>
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
                <span>{user?.dob}</span>
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
                <span>Plaece of residence:</span>
                <span>{user?.residence}</span>
                </div>
                </Col>
            </Row>

            <Row style={{padding:'7px'}}>
                <Col sx={12}>
                <div className="atrr">
                <span>ID issue date :</span>
                <span>{user?.issueDate}</span>
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
            <Row id="row" style={{display:'flex',justifyContent:'space-between'}}>
                <div>
                   <button className='button'>
                   <EditIcon/></button>
                   <button className='button left'><ContentCopyIcon/></button>
                </div>
                <div>
                    <button className='button'><RemoveIcon/></button>
                </div>
            </Row>
        </Container>
    )
}

export default View