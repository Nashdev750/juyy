const express  = require('express')

const app = express()

app.get('/api/index',(req,res)=>{
    res.send({users:"users"})
})

app.listen(3000)