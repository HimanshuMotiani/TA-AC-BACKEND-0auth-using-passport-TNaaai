var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name:String,
    email:{type:String},
    username:{type:String,required:true,unique:true},
},{timestamps:true})

module.exports = mongoose.model("User",userSchema);