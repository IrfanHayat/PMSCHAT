var mongoose = require('mongoose')
var chat = require('./models/chat');
var agent = require('./models/agent');
var db = mongoose.connect('mongodb://localhost:27017/meanauth');
const channel = 'chat';
var Pusher = require('pusher');
var pusher = new Pusher({
  appId: '598550',
  key: 'a8a44b6b63a732630089',
  secret: 'b4c7ac41ad5a2c63bc1b',
  cluster: 'ap2',
  encrypted: true
});
pusher.trigger('my-channel', 'my-event', {
  "message": "hello world"
});
// var agent_name  = req.params.name
const Collection = chat;
const changeStream = Collection.watch(
            { 
                $match:
                {
                  "status": "unassigned"               
                } 
        }

    );
    agent.aggregate(
    [
        { 
             $match:
             {
                 "name": 'jahanzaib'
                      
             } 
        },
        
        { 
            $lookup:
            { 
                from: "assignprojs",
                localField: "name",
                foreignField: "agent_name",
                as: "all_project"
            } 
        },
        {
            $lookup:
            {
                from: "chats",
                localField: "all_project.project_name",
                foreignField: "project_name",
                as: "all_chat"
            }

        }, 
        { $unwind: "$all_chat" }, 
        {
            $match: {  "name": 'jahanzaib',"all_chat.status": 'unassigned' }
        },

        {
            $project:
            { 
                'chat_id': "$all_chat._id", 
                'status': "$all_chat.status",
                "chat_projectName": "$all_chat.project_name"
            }

        }
    ],function(err,data){
        if (err) throw err;
        console.log(data)
    })

    changeStream.on('change', (change) => {
    console.log(change);
    if(change.operationType === 'insert') {
      const task = change.fullDocument;
      pusher.trigger(
        channel,
        'inserted', 
        {
          id: task._id,
          chat: task.task,
        }
      ); 
    } 
});











// const MongoClient = require('mongodb');
// const url = 'mongodb://localhost:27017,localhost:27018,localhost:27019/meanauth?replicaSet=rs';



// const update = {

//   $set: { 'status': '1' }, //this doesn't work with change streams

// };

// MongoClient.connect(url, (err, client) => {
//   const coll = client.db("meanauth").collection("chats");
//   const col2 = client.db("meanauth").collection("agents");
//   col2.aggregate(
//     [
        
//         { $match: { name: 'jahanzaib' } }, 

//         { 
//             $lookup:
//             { 
//                 from: "assignprojs",
//                 localField: "name",
//                 foreignField: "agent_name",
//                 as: "all_project"
//             } 
//         },
//         {
//             $lookup:
//             {
//                 from: "chats",
//                 localField: "all_project.project_name",
//                 foreignField: "project_name",
//                 as: "all_chat"
//             }

//         }, 
//         { $unwind: "$all_chat" }, 
//         {
//             $match: { "all_chat.status": 'unassigned' }
//         },

//         {
//             $project:
//             { 
//                 'chat_id': "$all_chat._id", 
//                 'status': "$all_chat.status",
//                 "chat_projectName": "$all_chat.project_name"
//             }

//         }
//     ],function (err, data)
// 		{
// 			if (err) throw err;
// 			else {
// 				console.log(data)
// 			}
// 	})

//   coll.updateMany({"project_name" : "DigiBot"}, update, { multi: true}).then(() => client.close());
// });