const mongoose =require('mongoose');
const { on } = require('./User');


const productSchema=new mongoose.Schema({
    
    category:String,
    discription:String,
    price:String,
    target:String,
    img:String,
    checkbox_1:String,
    checkbox_2:String,
    country:String,
    video:{data:Buffer,ContentType:String}


});

const Product=mongoose.model('Product',productSchema);
module.exports=Product