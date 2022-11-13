import { useEffect, useState } from "react"
import { Container, Row, Col } from "react-bootstrap"
import { getData } from "../api/api"
import NavBar from "../components/NavBar"

const Statistics = ()=>{
    const [userid,setUserid] = useState()
    const [users,setUsers] = useState({})
    const [customer,setCustomer] = useState({})
    const [customer2,setCustomer2] = useState({})
    const [clientsusers,setclientsusers] = useState([])
    
    useEffect(()=>{
        getData('users/statistics')
        .then(res=>{
            setUsers(res.data)
        })
        getData('users/clients/statistics')
        .then(res=>{
            setCustomer(res.data)
        })
        getData('customer/all')
        .then(res=>{
           if(!res.data?.error) setclientsusers(res.data)
        })
    },[])
    useEffect(()=>{
        if(!userid) return
        getData('users/clients/statistics/'+userid)
        .then(res=>{
            setCustomer2(res.data)
        })
    },[userid])
    return (
        <Container fluid>
            <Row>
                <NavBar/>
            </Row>
            <Row></Row>
            <Row>
                 <Col  xs = {12}>
                    <div className="user stat">
                        <h5>TOTAL STATISTICAL</h5>
                        <div className="data">
                            <div>
                                <span>Customer</span>
                                <span>{users?.clients}</span>
                            </div>
                            <div>
                                <span>Users Client</span>
                                <span>{users?.users}</span>
                            </div>
                            <div>
                                <span>Admin</span>
                                <span>{users?.admins}</span>
                            </div>
                        </div>
                    </div>
                 </Col>
                 <Col  xs = {12}>
                    <div className="user stat">
                    <h5>TOTAL STATS BY STATUS</h5>
                    <div className="data">
                            <div>
                                <span className="approved">Approved</span>
                                <span>{customer?.approved}</span>
                            </div>
                            <div>
                                <span className="waiting">waiting</span>
                                <span>{customer?.waiting}</span>
                            </div>
                            <div>
                                <span className="signed">Signed</span>
                                <span>{customer?.signed}</span>
                            </div>
                            <div>
                                <span className="success">Success</span>
                                <span>{customer?.success}</span>
                            </div>
                            <div>
                                <span className="fail">Failed</span>
                                <span>{customer?.fail}</span>
                            </div>
                            <div>
                                <span className="canceled">Canceled</span>
                                <span>{customer?.canceled}</span>
                            </div>
                        </div>
                    </div>
                 </Col>
                 <Col  xs = {12}>
                    <div className="user stat">
                    <h5>Status according to Users Client</h5>
                    <div className="input" style={{maxWidth:'200px'}}>
                        <select
                         onChange={e=>setUserid(e.target.value)}
                        >
                            <option value="" selected>Select Client</option>
                            {clientsusers.map((item,i)=>(
                                <option key={i} value={item._id}>{item.username}</option>
                            ))}
                        </select>
                    </div>
                    <div className="data">
                            <div>
                                <span className="approved">Approved</span>
                                <span>{customer2?.approved}</span>
                            </div>
                            <div>
                                <span className="waiting">waiting</span>
                                <span>{customer2?.waiting}</span>
                            </div>
                            <div>
                                <span className="signed">Signed</span>
                                <span>{customer2?.signed}</span>
                            </div>
                            <div>
                                <span className="success">Success</span>
                                <span>{customer2?.success}</span>
                            </div>
                            <div>
                                <span className="fail">Failed</span>
                                <span>{customer2?.fail}</span>
                            </div>
                            <div>
                                <span className="canceled">Canceled</span>
                                <span>{customer2?.canceled}</span>
                            </div>
                        </div>
                    </div>
                 </Col>
            </Row>
        </Container>
    )
}

export default Statistics