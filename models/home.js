const mongoose=require('mongoose');

const homeSchema=mongoose.Schema({
    houseName:{
        type:String,
        required:true
    },
    pricepernight:{
        type:Number,
        required:true
    },
    Location:{
        type:String,
        required:true
    },
    Rating:{
        type:Number,
        required:true
    },
    photourl:{
        type:String,
    
    },
    description:{
        type:String
    },
    

})

module.exports= mongoose.model('Home',homeSchema);