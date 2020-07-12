


var onlineUsers = {};//Define empty Object for online Users
var count = 0;
var test = {};
io.on('connection', function(socket){

  var room = socket.handshake['query']['r_var'];
  if(room==''){

    io.to(room).emit('chat message', 'you are not');
  }

  socket.join(room);
  console.log('user joined room #'+room);


  
   //If Some One Login
  socket.on('OnLogin',function(data){
    var resArr = {};
        resArr.currentLoginUsr_Id = data.currentLoginUsr_Id;
        resArr.currentLoginUsrName = data.currentLoginUsrName;
        
    var lginUserId = data.currentLoginUsr_Id;
    var socketId   = socket.id;


if(!onlineUsers.hasOwnProperty(socketId)){

    if(!checkObjectVal(onlineUsers,lginUserId)){
      onlineUsers[socketId] = lginUserId;

       io.to(room).emit('UserOnline',resArr);
       count++;
    }else{
      onlineUsers[socketId] = lginUserId;
    }

    var total ='Total'+count;
   
}
   

  });//End  OnLogin


  //functuion to find a vale exist or not
     function checkObjectVal(objArr,value){

      for (const index in objArr) {

        if (objArr[index] === value) {

          return true;

        }else{

        return false;

        }
      }

    }//End  Of Check Value


//Disconnect function
  socket.on('disconnect', function() {

    var ArrRes = {};
    var deleteSocketID  = socket.id; 

    if(onlineUsers.hasOwnProperty(deleteSocketID)){

      var deleteSocketIDUser = onlineUsers[deleteSocketID];


      delete onlineUsers.deleteSocketID; 


      if(!checkObjectVal(onlineUsers,deleteSocketIDUser)){

          count--;

          var send = 'delet'+count;

        ArrRes.currentLoginUsr_Id = deleteSocketIDUser;
          io.to(room).emit('UserOffline',ArrRes);

      }//End Of UserId

    }//End If Check Socket Id
    
    socket.leave(room);
  });


	socket.on('SendMessage', function (data) {
		   
		     //io.to(room).emit('ShowMessage',data);
         socket.broadcast.to(room).emit('ShowMessage', data);
		});

//Delet a Message
  socket.on('DeleteMessage', function(commentId){

       io.to(room).emit('ShowDeleteMessage', commentId);
  });

 // Update a Message
  socket.on('UpdateMessage',function(data){

  	io.to(room).emit('ShowUpdateMessage', data);

  });//End of Update a Message


  //Some one Pink

  socket.on('someOnePink',function(data){

    socket.broadcast.to(room).emit('ShowsomeOnePink', data);

  });//End of someOnePink

});


