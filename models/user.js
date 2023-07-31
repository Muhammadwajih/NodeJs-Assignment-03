const mongoose = require('mongoose');
 
const StudentSchema = new mongoose.Schema({
    name: {type : String, required: true},
    password : {type : String , required: true},
    token: {type : String}
});
  
module.exports = mongoose.model(
    'student', StudentSchema, 'Students');