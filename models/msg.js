var mongoose=require('mongoose');
var Schema = mongoose.Schema;

var msgSchema=new Schema({
    msg:{type:String,required:true,unique:false}

});


module.exports=mongoose.model('msg',msgSchema);