var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomSchema = new Schema({
    roomName : {type:String,required:false},
    agent_Name :{type:String,required:false},
    mesg_id:{type:String,required:false}
    
})

module.exports = mongoose.model('Room',roomSchema);