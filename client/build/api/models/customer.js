const mongoose  = require('mongoose')

const customerSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    role:{
        type:String,
        require: false,
        default:'user'
    },
    status:{
        type:Boolean,
        require: false,
        default:true
    },

},{timestamps:true})
const customer = mongoose.model('customer',customerSchema)

module.exports = {customer}