const mongoose  = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
    user:{
        type:String,
        require:false
    },
    clientID:{
        type:String,
        require:false
    },
    clientName:{
        type:String,
        require: true
    },
    dob:{
        type:String,
        require:false
    },
    sex:{
        type:String,
        require:true
    },
    residence:{
        type:String,
        require:false
    },
    issueDate:{
        type:String,
        require:false
    },
    phone:{
        type:String,
        require:false
    },
    clientid9:{
        type:String,
        require:false
    },
    notes:{
        type:String,
        require:false
    },
    files:{
      type: Array,
      require: false  
    },
    status:{
      type: Number,
      require: false,
      default: 0  
    },
    approvalDate:{
      type: String,
      require: false,
      default: '' 
    },
    signedDate:{
        type: String,
        require: false,
        default: ''  
    },
    successDate:{
        type: String,
        require: false,
        default: ''  
    }
},{timestamps:true})
userSchema.plugin(AutoIncrement, {inc_field: 'code'});
const user = mongoose.model('clients',userSchema)

module.exports = {user}