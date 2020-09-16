const mongoose =require('mongoose');


const productSchema=new mongoose.Schema({
    
    category:String,
    discription:String,
    price:String,
    target:String,
    img:{data:Buffer,ContentType:String},


});

const Product=mongoose.model('Product',productSchema);
module.exports=Product