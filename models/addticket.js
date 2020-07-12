var mongoose=require('mongoose');
var Schema = mongoose.Schema;
//  var Joi=require('@hapi/joi');

var addTicketSchema=new Schema({
    ticketName:{type:String,required:true,unique:false},
    ticketPriority:{type:String,required:false,unique:false},
    employee:{type:String,required:false,unique:false},
    description:{type:String,required:false,unique:false},
    milestone:{type:String,required:false,unique:false},
    
    guestEmail:{type:String,required:false,unique:false},
    date:{type:Date,required:false,unique:false}

    
    
});
// function validateTicket(ticket) {
       
//     const schema = {
//         ticketName: Joi.string().min(5).max(10),
//         ticketPriority: Joi.string().min(5).max(10),
//        employee: Joi.string().min(5).max(10),
//        description: Joi.string().min(5).max(10),
//        milestone:Joi.string().min(5).max(10),
//        guestEmail:Joi.string().min(5).max(10),
//        date:Joi.date().min(5).max(10)
//     };    
//     return Joi.validate(ticket, schema);
//   }

var addTicket=mongoose.model('addTicket',addTicketSchema);


// exports.validateTicket = validateTicket; 
exports.addTicket =addTicket;