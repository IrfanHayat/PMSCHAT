var mongoose=require('mongoose');
var Schema = mongoose.Schema;
//  var Joi=require('@hapi/joi');

var addDigiebotUser=new Schema({
    id:{type:String,required:true},
    username:{type:String,required:true},
    email:{type:String,required:true}
});


var addDigiebotUsers=mongoose.model('digiebot',addDigiebotUser);


// exports.validateTicket = validateTicket; 
exports.addDigiebotUsers =addDigiebotUsers;