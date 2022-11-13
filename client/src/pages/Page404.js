import { Link } from "react-router-dom"

const Page404 = ()=>{
   return <div
     style = {{
        height: "100vh",
        width:'100vw',
        display: 'flex',
        justifyContent:'center',
        alignItems:'center'
     }}
    >
      <h1>404 Not Found</h1> 
      <Link to='/' 
      style={{
        position:'absolute',
        top:'20px',
        left:'20px'
      }}
      >Home</Link>
    </div>
}

export default Page404