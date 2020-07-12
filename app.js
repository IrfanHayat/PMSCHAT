var express = require('express');
var cors = require('cors');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var passport = require('passport');
var http = require("http");
var api = require('./routes/api');
var mongoose = require('mongoose');
var morgan = require('morgan');
var chat = require('./chat');
var test = require('./test');
var socket = require('socket.io');
var agent = require('./routes/agent');
var session = require('express-session')
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var https = require('https')
const config = require('./config/database');
var fs = require('fs')
var useragent = require('express-useragent');
var digiebot=require('./routes/digibotInfo')
var app = express();
var db;
//Database connection mongodb://mzparacha:Samiiui5787@ds147734.mlab.com:47734/vizzlive
mongoose.connect('mongodb://localhost:27017/vizzlive', function (err, database) {
  if (err) {
    console.log("Error connecting to db!");
  } else {
    console.log("connected to db " + 3000);
    db = database;
  }
});

app.use(morgan('dev'));
app.use(cors());
require('./config/passport')(passport);

app.use(useragent.express());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}))
app.use(bodyparser.json());
app.use(flash());
app.use(bodyparser.urlencoded({ 'extended': 'false' }));
app.use(cookieParser());

app.use('/api', api);
app.use('/agent', agent);
app.use('/digiebot',digiebot)



app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Iam an Error Please First Remove me Then??' + err.stack)
})

app.use('',express.static(path.join(__dirname, 'dist')));

app.use('/login', express.static(path.join(__dirname, 'dist')));

app.use('/register', express.static(path.join(__dirname, 'dist')));

app.use('/dashboard', express.static(path.join(__dirname, 'dist')));

app.use('/agent-dashboard', express.static(path.join(__dirname, 'dist')));

app.use('/agent-login', express.static(path.join(__dirname, 'dist')));
app.use('/assigned-projects', express.static(path.join(__dirname, 'dist')));

app.use('/proj-page/:project_name/:project_Id/:username/:useremail', express.static(path.join(__dirname, 'dist')));
app.use('/proj-page/:project_name/:project_Id', express.static(path.join(__dirname, 'dist')));
app.use('/visitors', express.static(path.join(__dirname, 'dist')));
app.use('/history', express.static(path.join(__dirname, 'dist')));
app.use('/tickets', express.static(path.join(__dirname, 'dist')));




var port = process.env.PORT || process.env.port  || 3000;


var server = https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app)
.listen(port, function () {
  console.log('Example app listening on port '+port+'! Go to https://localhost:'+port+'/')
})

// var server = http.createServer(app)
// .listen(port, function () {
//   console.log('Example app listening on port '+port+'! Go to http://localhost:'+port+'/')
// })

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//**************************************************Sockets**********************************************************


global.io = require('socket.io')(server);

var users = {};


io.on('connection', function (socket) {
  


    socket.on('join', function (roomno) {
      socket.join(roomno);
      console.log('user joined room -> '+roomno)
    });

    socket.on('login', function(data){
      console.log('a user ' + data.userId + ' connected');
  
      users[socket.id] = data.userId;
    });

    socket.on('connection', function (socket) {
      console.log('connected')
      
    })

    socket.on('leave', function(room) { 
      console.log('user Left room -> '+room)
      socket.leave(room); 
    })

    socket.on('new-message', function (message,id) {
      io.sockets.in(id).emit('new-message', message);
    });
   
    socket.on('update-message',(message,chat_id,time)=>{
      console.log("Node Chat ser",time)
       io.sockets.in(chat_id).emit('update-message',message,time)
    })
   
    socket.on( 'new_notification', function( data ) {
    
      socket.broadcast.emit( 'show_notification', { 
       message: data 
        
      });
    });

    socket.on('chat-update', function (data) {
      io.sockets.in(data.project_id).emit('chat-update', data.chat_id);
    });

    socket.on('remove-customer', function (data) {
      io.sockets.in(data.project_id).emit('remove-customer',data);
    });

    socket.on('agent-assigned', function (data) {
      io.sockets.in(data.project_id).emit('agent-assigned',data);
    });

    socket.on('transfer-chat', function (data) {
      io.sockets.in(data.agent_id).emit('new-customer',data);
    });

    socket.on( 'disconnect', function () {
      console.log( 'disconnected from server' );
      io.sockets.emit('disconnect');
    });

    socket.on('online-agents', function (data) {

      var extdata = {
        data:io.sockets.adapter.rooms[data.roomno], // Check how much agents are loged in with the project_id in roomno
        project_id:data.roomno,                     // Set project_id from roomno as it is project's id
        user:data.user                              // This is the agent who loged in now and fired event if the event is fired by client user will be undefined
      }

      io.sockets.in(data.listeningroom).emit('online-agents',extdata); // Emit event on the project name as all the client's of one project would listen on project name in order to listen common events
      if(data.user){
        io.sockets.in(data.user.company_id).emit('online-agents',extdata);
      }
    });

    socket.on('agent-logout', function () {
      var rooms = io.sockets.adapter.sids[socket.id]
      for(var room in rooms) { 
        socket.leave(room); 
      }

    });

    socket.on('chat-left', function (chat_id) {
      io.sockets.in(chat_id).emit('chat-left',chat_id);
    });

    socket.on('typing', function (data) {
      io.sockets.in(data.roomno).emit('typing',data);
    });

    socket.on('test', function (data) {
      console.log("tested")
    });
    
   
  })



module.exports = app;














