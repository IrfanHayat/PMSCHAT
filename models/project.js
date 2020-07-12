var mongoose=require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = require('mongodb').ObjectID;

var projectSchema=new Schema({
    name:{type:String,required:true,unique:true},
    url:{type:String,required:true,unique:true},
    company_Id : {type:String},
    primarycolor:{type:String},
    secondarycolor:{type:String},
     
});



var project =  module.exports=mongoose.model('Project',projectSchema);

module.exports.addproject = function(project,callback){
  
    project.save(callback);

 }

 module.exports.deleteproject = function(projectid,callback){
  
    project.remove({_id:ObjectId(projectid)},callback);

 }

module.exports.getProjectByName  = function(name,callback){
  
    const query = {name:name};
    project.findOne(query, callback);
};