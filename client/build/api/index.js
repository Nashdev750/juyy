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
const {authenticateGoogle, uploadToGoogleDrive,createFolder} = require('./utils/google')
const cluster = require('cluster')
const { doubleclickbidmanager } = require('googleapis/build/src/apis/doubleclickbidmanager')

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

var upload = multer({ storage:multer.memoryStorage() });

app.get('/api',middleware,(req,res)=>{
    res.send({success:true});
})
// create user
app.post('/api/adduser',middleware,upload.array('files'),async function(req,res){
        let files = req.files
        let dup = await user.find({clientID:req.body.clientID}).lean()
        if(dup.length>0) return res.send({error:'Client ID already exists'})
        let dup1 = await user.find({clientid9:req.body.clientid9}).lean()
        if(dup1.length>0) return res.send({error:'Client ID 9 already exists'})
        let dup2 = await user.find({phone:req.body.phone}).lean()
        if(dup2.length>0) return res.send({error:'Phone number already exists'})
        const newuser = new user(req.body)
        
        if(Array.isArray(files)){
          let auth = authenticateGoogle()
          const folderid = await createFolder(auth,newuser._id)
          for (let i = 0; i < files.length; i++) {
            uploadToGoogleDrive(files[i],auth, folderid?.data?.id)
          }
          newuser.files = 'https://drive.google.com/drive/u/0/folders/'+folderid?.data?.id
        } 
        newuser.save()
        res.send(newuser)
       
});
// edit user
app.post('/api/edituser/:id',middleware,upload.array('files'),async function(req,res){
        let files = req.files
        let newuser = await user.findOneAndUpdate({_id:req.params.id},req.body)
        if(Array.isArray(files)){
          let auth = authenticateGoogle()
          let folder = ''
          if(newuser?.files){
           folder = newuser.files.split('/')[newuser.files.split('/').length -1]
          }else{
            const folderid = await createFolder(auth,newuser._id)
            folder = folderid?.data?.id
            newuser.files = 'https://drive.google.com/drive/u/0/folders/'+folder
          }
          for (let i = 0; i < files.length; i++) {
            uploadToGoogleDrive(files[i],auth, folder)
          }
          newuser.save()
        }
        res.send(newuser)
       
});

// get users
app.get('/api/users',middleware,async (req,res)=>{
  let users = []
  if(req.user.role === 'admin'){
    users = await user.find().sort({createdAt:-1}).lean()
  }else{
    users = await user.find({userid:req.user._id}).sort({createdAt:-1}).lean()
  }
 res.send(users)
})

// get users statistics
app.get('/api/users/statistics',middleware,async (req,res)=>{
  if(req.user.role !== 'admin') return res.send({})
    const users = await user.find().lean()
    const customers = await customer.find().lean()
    let data = {}
    let adms = customers.filter(u=>u.role === 'admin')
    data['clients'] = users.length
    data['admins'] = adms.length
    data['users'] = customers.length - adms.length
 res.send(data)
})
// get users statistics
app.get('/api/users/clients/statistics',middleware,async (req,res)=>{
  if(req.user.role !== 'admin') return res.send({})
    const users = await user.find().lean()
    let waiting = users.filter(u=>u.status === 'waiting')
    let approved = users.filter(u=>u.status === 'approved')
    let signed = users.filter(u=>u.status === 'signed')
    let success = users.filter(u=>u.status === 'success')
    let fail = users.filter(u=>u.status === 'fail')
    let canceled = users.filter(u=>u.status === 'canceled')
    let data = {
      waiting:waiting.length,
      approved:approved.length,
      signed:signed.length,
      success:success.length,
      fail:fail.length,
      canceled:canceled.length,
    }

 res.send(data)
})
// get users statistics
app.get('/api/users/clients/statistics/:id',middleware,async (req,res)=>{
  if(req.user.role !== 'admin') return res.send({})
    const users = await user.find({userid:req.params.id}).lean()
    let waiting = users.filter(u=>u.status === 'waiting')
    let approved = users.filter(u=>u.status === 'approved')
    let signed = users.filter(u=>u.status === 'signed')
    let success = users.filter(u=>u.status === 'success')
    let fail = users.filter(u=>u.status === 'fail')
    let canceled = users.filter(u=>u.status === 'canceled')
    let data = {
      waiting:waiting.length,
      approved:approved.length,
      signed:signed.length,
      success:success.length,
      fail:fail.length,
      canceled:canceled.length,
    }

 res.send(data)
})

// get users
app.get('/api/users/customer/:id',middleware,async (req,res)=>{
 const users = await user.find({_id:req.params.id}).lean()
 res.send(users)
})
// get user
app.get('/api/user/:id',middleware,async (req,res)=>{
 const user1 = await user.findOne({_id:req.params.id}).lean()
 res.send(user1)
})
// search user
app.post('/api/user/:id',middleware,async (req,res)=>{
 const user1 = await user.find(req.body).lean()
 res.send(user1)
})
// search user
app.get('/api/user/delete/:id',middleware,async (req,res)=>{
  if(req?.user?.role !== 'admin') return res.send({error:"You are not allowed to perform this action"})
  try {
    const user1 = await user.findOneAndRemove({_id:req.params.id})
    res.send(user1)
  } catch (error) {
    console.log(error)
    res.send({error:'User not found'})
  }
 
})
// create a new customer
app.post('/api/customer/create',middleware,async (req,res)=>{
  if(req?.user?.role !=='admin') return res.send({error:'You are not allowed to create user'})
  let dup = await customer.find({username:req.body.username}).lean()
        if(dup.length>0) return res.send({error:'username already taken'})
  const salt = genSaltSync(10)
  req.body.password=hashSync(req.body.password,salt)
  const newcustomer = new customer(req.body)
  newcustomer.save()
  res.send(newcustomer)

})
// edit customer
app.post('/api/customer/edit/:id',middleware,async (req,res)=>{
  let uid = req.params.id
  if(req?.user?.role !=='admin'){
    uid = req.user._id
    req.body.role = 'user'  
  } 
  delete req.body?.username  
  if(req.body?.password =="") delete req.body?.password     
  if(req.body?.role =="") delete req.body?.role 
  if(!req.body?.role && !req.body?.password)  return res.send({error:'Password or role is required'})  
  if(req.body?.password){
    const salt = genSaltSync(10)
    req.body.password=hashSync(req.body.password,salt)
  }      
  const newcustomer = await customer.findOneAndUpdate({_id:uid},req.body)
  res.send(newcustomer)

})
// get all customer
app.get('/api/customer/all',middleware,async (req,res)=>{
  let customers = await customer.find({role:'user'}).lean()
  res.send(customers)
})
// get all customer
app.get('/api/accounts/all',middleware,async (req,res)=>{
  let customers = []
  if(req?.user?.role ==='admin'){
      customers = await customer.find().lean()
  }else{
      customers = await customer.find({_id:req.user._id}).lean()
  }
  res.send(customers)
})
// delete customer
app.get('/api/accounts/delete/:id',middleware,async (req,res)=>{
  if(req?.user?.role !=='admin') return res.send({error:'Request denied'})
  if(req.user._id === req.params.id) return res.send({error:"Cannot delete self account"})
  let customers = await customer.findOneAndDelete({_id:req.params.id})
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
if(cluster.isMaster){
  let cpus = require('os').cpus().length
  for (let i = 0; i < cpus; i++) {
    cluster.fork()
  }
  cluster.on('exit',()=>cluster.fork)
}else{
  app.listen(8000,()=>console.log('instance'))
}