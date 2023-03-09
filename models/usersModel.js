const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    access:{
        type:Boolean,
        default:true
    },
    address:{
        type:String,
        default:''
    }
} ,{
    timestamps:true
});

module.exports = mongoose.model('users',userSchema);