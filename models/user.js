const mongoose=require('mongoose');
const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastname:{
        type:String
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    userType:{
        type:String,
        enum:['host','guest'],
        default:'guest'
    },
    favourite:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Home'
    }],
    bookings:[{
       home:{ type:mongoose.Schema.Types.ObjectId,ref:'Home'},
        isPaid: { type: Boolean, default: false },
        paymentId: { type: String },
        
    }]
});
module.exports= mongoose.model('User',userSchema);