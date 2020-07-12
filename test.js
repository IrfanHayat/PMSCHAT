var express = require('express');
var router = express.Router();
var Agent = require('./models/agent');

router.get('/find', function (req, res, next)
{
	Agent.aggregate(
	[
		
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
	], function (err, data)
		{
			if (err) { res.json(err) }
			else {
				res.json(data)
				console.log(data)
			}
	})
});


module.exports = router;
