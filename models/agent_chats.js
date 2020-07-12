var mongoose  = require('mongoose');

var agent_chatSchema = mongoose.Schema({
    agent_id : {type:String},
    agent_name : {type:String,required:false},
    status : {type:String,required:false},
    allocated_chats : {type:String,required:false}


});

module.exports = mongoose.model('agent_chats',agent_chatSchema);