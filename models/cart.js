const mongoose = require('mongoose');
 
const CartSchema = new mongoose.Schema({
    username: {type : String},
    products: {type : Array},
    total_price:{type : Number},
    status: {type : String},
    id: {type : Object}
});
  
module.exports = mongoose.model(
    'cart', CartSchema, 'Cart');