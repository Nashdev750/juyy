const express  = require('express')
const multer = require("multer")
const cors = require('cors')
const path = require('path')
const mongoose  = require('mongoose')
const { user } = require('./models/user')
const { customer } = require('./models/customer')
const { middleware } = require('./utils/middleware')
const { genSaltSync, hashSync,compareSync } = require("bcrypt")
const { sign,verify } = require("jsonwebtoken")

const app = express()
app.use(cors({origin:'*'}))
app.use(express.json());

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, 'uploads');
    },
    filename: function (req, file, callback) {
      callback(null,  'file_'+Date.now() + '-' + file.originalname);
    }
  });

var upload = multer({ storage });

app.get('/api',middleware,(req,res)=>{
    res.send({success:true});
})
// create user
app.post('/api/adduser',upload.array('files'),function(req,res){
        let files = req.files
        if(Array.isArray(files)){
            req.body['files'] = files
        }
        const newuser = new user(req.body)
        newuser.save()
        res.send(newuser)
       
});
// edit user
app.post('/api/edituser/:id',upload.array('files'),async function(req,res){
        let files = req.files
        if(Array.isArray(files)){
            req.body['files'] = files
        }
        let newuser = await user.findOneAndUpdate({_id:req.params.id},req.body)
        res.send(newuser)
       
});

// get users
app.get('/api/users',async (req,res)=>{
 const users = await user.find().lean()
 res.send(users)
})

// get user
app.get('/api/user/:id',async (req,res)=>{
 const user1 = await user.findOne({_id:req.params.id}).lean()
 res.send(user1)
})
// search user
app.post('/api/user/:id',async (req,res)=>{
 const user1 = await user.find(req.body).lean()
 res.send(user1)
})
// create a new customer
app.post('/api/customer/create',async (req,res)=>{
  const salt = genSaltSync(10)
  req.body.password=hashSync(req.body.password,salt)
  const newcustomer = new customer(req.body)
  newcustomer.save()
  res.send(newcustomer)

})
// get all customer
app.get('/api/customer/all',async (req,res)=>{
  let customers = await customer.find().lean()
  res.send(customers)
})

app.post('/api/login',async (req,res)=>{
  if(!req.body?.password || !req.body.username)  return res.send({error:'username and password required'})
  const customers = await customer.find({username:req.body?.username}).lean()
  if(customers.length !==1){
    return res.send({error:'User not found'})
  }
  if(!compareSync(req.body?.password,customers[0].password)) return res.send({error:"Username or password is wrong"})
  delete customers[0].password
  let token = sign(customers[0],"key12wert",{
        expiresIn:'20h'
       })
  res.send({
    user:customers[0],
    token
  })
})

mongoose.connect('mongodb://localhost/usermanagement')

app.listen(8000)