const mongoose = require('mongoose');
 
const ProductSchema = new mongoose.Schema({
    name: {type : String},
    price: {type : Number},
    category: {type : String},
    id: {type : Object}
});
  
module.exports = mongoose.model(
    'product', ProductSchema, 'Products');