var mongoose = require('mongoose');

var ChatSchema = new mongoose.Schema({
  user_name: {type:String,required:false},
  project_Id : {type:String},
  project_name : {type:String},
  customer_email:{type:String},
  status :{type:String},
  
  messages:[{
    message:{type:String,required:false},
    sender:{type:String},
    time:{type:String},
    id:{type:Number},
    rating:{type:String},
    comment:{type:String}
  }],
  
  agent_id:{type:String},
  ip:{type:String},
 location:{
 country:{type:String,required:false},
 city:{type:String,required:false},
  
},
  useragent:mongoose.Schema.Types.Mixed
  
});


var chat = module.exports = mongoose.model('Chat', ChatSchema);


module.exports.getUserByEmail  = function(email,callback){
  const query = {customer_email:email};
  chat.findOne(query, callback);
};

module.exports.getUserById  = function(id,callback){
    chat.findById(id,callback);
};
