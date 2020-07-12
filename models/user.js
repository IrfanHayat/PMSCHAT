var mongoose = require('mongoose');
var bcrypt  = require('bcryptjs');
var config = require('../config/database');

var userSchema = mongoose.Schema({
    username : {type:String,required:true,unique:true},
    email : {type:String,required:false},
    password : {type:String,required:true},
    user_role : {type:String,required:false},
    // status    : {type:Boolean,required:true}
});

var user = module.exports = mongoose.model('user',userSchema);

module.exports.getUserById  = function(id,callback){

    user.findById(id,callback);
};

module.exports.getUserByUsername  = function(username,callback){
    const query = {username:username};
    user.findOne(query, callback);
};

module.exports.adduser = function(newUser,callback){

    bcrypt.genSalt(10,function(err,salt)
    {
        bcrypt.hash(newUser.password,salt,function(err,hash)
        {
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);

        });
    });
    
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch){
    if(err) throw err;
    callback(null, isMatch);
  });
}



