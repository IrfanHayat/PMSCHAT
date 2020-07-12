var mongoose = require('mongoose');

var assignProj = new mongoose.Schema({
  agent_name: {type:String},
  project_Id:{type:String}
 
});

module.exports = mongoose.model('assignProj', assignProj);