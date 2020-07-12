var mongoose=require('mongoose');
var bcrypt  = require('bcryptjs');
var Schema = mongoose.Schema;

var agentSchema=new Schema({
    name:{type:String,required:true,unique:true},
    password: {type:String,required:true},
    status:{type:String,required:false},
    date:{type:Date,required:false},
    company_Id : {type:String},
    assigned_projects:[],
    login:{type:Boolean}
});

var user = module.exports = mongoose.model('agent',agentSchema);

module.exports.getUserById  = function(id,callback){

    user.findById(id,callback);
};

module.exports.getUserByUsername  = function(username,callback){
    const query = {name:username};
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
