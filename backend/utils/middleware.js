const { genSaltSync, hashSync,compareSync } = require("bcrypt")
const { sign,verify } = require("jsonwebtoken")
const middleware = (req,res,next)=>{
    let token = req.get('authorization')
    if(!token){
        return res.send({error:"token is required"})
    }else if(token){
        verify(token.slice(7),"key12wert",(err,user)=>{
            if(user){
                req.user = user
                next()
            }else{
                return res.send({error:"Invalid access token"})
              }
        })
     
    }

}

module.exports = {middleware}