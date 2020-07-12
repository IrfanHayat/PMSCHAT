'use strict';
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Project = require('../models/project');
var passport = require('passport');
const jwt = require('jsonwebtoken');
var config = require('../config/database');
var Agent = require('../models/agent');
var multer = require('multer');
var startChat = require('../models/chat');
let ObjectId = require('mongodb').ObjectID;
const requestIp = require('request-ip');

const {addTicket } = require('../models/addticket');
 var geoip = require('geoip-lite');


const paginate = require('express-paginate');

router.use(paginate.middleware(10, 50));

//File Uploading
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)

	}
})
var upload = multer({ dest: "uploads/" }).array("uploads[]", 12)

router.put('/upload', function (req, res) {
	console.log('node upload main function !');
	upload(req, res, function (err) {
		if (err) throw err;

		console.log('file uploaded');

	});
})


//Register Company
router.post('/register', function (req, res) {
	
	var newUser = new User();
	newUser.username = req.body.username;
	newUser.email = req.body.email;
	newUser.password = req.body.password;
	if (req.body.username == null || req.body.username == '' || req.body.email == null || req.body.email == '' || req.body.password == null || req.body.password == '') {
		
		res.json({ success: false, msg: 'Ensure username,password, and email are provided' });
	}
	else {
		User.getUserByUsername(newUser.username, function (err, data) {
			if (err) throw err;

			if (data) {
				res.json({ success: false, msg: 'Company already registered' });
				res.end();
			} else {
				User.adduser(newUser, function (err) {
					if (err) {
						res.json({ success: false, msg: "Error while registering" });
						console.log(err);
					}
					else {
						res.json({ success: true, msg: 'User Registered Successfully' });
						
					}
				});
			}
		})

	}

});


//Authenticate Comapny
router.post('/authenticate', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;


	User.findOne({ username: req.body.username }, function (err, user) {
		if (err) throw err;
		if (!user) {
			return res.json({ success: false, msg: 'Company does not found with this name' });
		}
		else if (user) {
			if (req.body.password) {
				User.comparePassword(password, user.password, function (err, isMatch) {
					if (err) throw err;

					if (isMatch) {
						var token = jwt.sign({ data: user }, config.secret, { expiresIn: 604800 });
						res.json({
							success: true,
							message: "User authenticated",
							token: 'JWT ' + token,
							user: {
								id: user._id,
								username: user.username,
								email: user.email,
								password: user.password
							}
						});
						req.session.message = "Login Successfull"
					} else {
						req.session.message = "Login failed"
						return res.json({ success: false, msg: 'Password does not match' });

					}

				});
			}
		}
	});
});


// Profile
router.get('/dashboard', passport.authenticate('jwt', { session: false }), (req, res, next) => {

	User.getUserByUsername(req.user.username, function (err, data) {
		if (err) throw err;
		
		if(data != null && typeof data != 'undefined'){
			res.json({ user: req.user });
		}else{
			res.json({user:null})
		}

	})
});

router.get('/agent-board', passport.authenticate('jwt', { session: false }), (req, res, next) => {
	res.json({ user: req.user });
});


router.get('/agents-detail',async (req,res)=>{
	let result= await Agent.find({})
	res.status(200).json(result)
})

router.get('/agents-detail/:id',async (req,res)=>{
	let result=await Agent.find({_id:req.params.id})
	res.status(200).json(result)

})

//Adding Projects By Comapny

router.post('/addproject/:comapny_Id', function (req, res) {

	var project = new Project();
	project.name = req.body.proname;
	project.url = req.body.url;
	project.company_Id = req.params.comapny_Id;
	project.primarycolor = '#00BCD4'
	project.secondarycolor = '#56c2d0'
	if (req.body.proname == null || req.body.proname == '' || req.body.url == null || req.body.url === '') {
		res.json({ success: false, msg: 'Ensure project Name and URL added' });
	}
	else {
		Project.getProjectByName(project.proname, function (err, data) {
			if (err) throw err;

			if (data) {
				res.json({ success: false, msg: 'This Project is already added' });
				res.end();

			}else {
				Project.addproject(project, function (err,data) {
					if (err) {
						res.json({ success: false, msg: "Error while adding project might be same URL added before for another project" });
						console.log(err);
					}
					else {
						res.json({ success: true, msg: 'Project Added Successfully',data:data });
					}
				});
			}

		})

	}
});

router.post('/removeproject', function (req, res) {
	

	Agent.update({},{$pull:{assigned_projects:req.body.id}},{ multi: true },(err,data)=>{
		if(err) throw err;

		Project.deleteproject(req.body.id,(err,data)=>{
			if(err) throw err;
			
			res.json({success:true,msg:'Project Deleted'})
		})
	})

})

// Listing of Projects Added By Company
router.get('/project/:company_Id', function (req, res) {

	Project.find({ company_Id: req.params.company_Id }, function (err, project) {
		if (err) return next(err);
		res.json(project);
	});
});

// Listing of All Agents Added By Company against projectss
router.get('/agent/:company_Id', function (req, res) {

	Agent.find({ company_Id: req.params.company_Id }, { "name": "$name" }, function (err, agent) {
		if (err) return next(err);
		res.json(agent);
	});
});


//*************************************************************************************************** */
// Load message agent selects a particular chat
router.get('/get_message/:chat_Id', function (req, res) {

	startChat.findOne({ _id: ObjectId(req.params.chat_Id) }, function (err, message) {
		if (err) return next(err);
		
		if(message == null){
			res.json(null)
		}else{
			res.json(message);
		}

	})
})

router.get('/get_messages/:chat_Id',async function (req, res) {
	let object=await startChat.findOne({ _id: ObjectId(req.params.chat_Id) })
	res.send(object)
})

router.get('/get_particular_message/:chat_Id/:message_Id',async (req,res)=>{
	 let object=await startChat.findOne({_id: ObjectId(req.params.chat_Id)})
	 object.messages.forEach(result=>{
            res.json(result)
	 })

})


router.put('/update_message/:chat_Id/:time',async (req,res)=>{
	var sender;
	var message; 
	var time;
	
	
      
	 let object= await startChat.update({_id:ObjectId(req.params.chat_Id),messages:{$elemMatch:{time:req.params.time}}},{$set:{'messages.$.sender':req.body.sender,'messages.$.message':req.body.message,'messages.$.time':req.body.time}})
         
	 res.json({
		 object
	 })

})






router.get('/project', function (req, res) {

	Project.find({}, { "name": "$name", "project_name": "$project_name" }, function (err, agent) {
		if (err) return next(err);
		res.json(agent);
	});
});



router.get('/find_customers', function (req, res) {
	startChat.find({ "status": "open" }, function (err, data) {
		if (err) return next(err);
		res.json(data);
	});
});




//Get CompanyData to display on company dashoard
router.get('/companyData/:id', function (req, res) {
	User.find({ _id: req.params.id }, { "_id": "$_id", "username": "$username" }, function (err, data) {
		if (err) throw err;
		res.json(data);
	})
})










//Register Agent
router.post('/addagent/:company_Id', function (req, res) {
	try{
		var datetime = new Date();
		var newUser = new Agent();
		newUser.name = req.body.name;
		newUser.password = req.body.password;
		newUser.company_Id = req.params.company_Id;
		newUser.date=datetime;


		if (req.body.name == null || req.body.name == '' || req.body.password == null || req.body.password == '') {
			res.json({ success: false, msg: 'Ensure fields are filled' });
		}
		else {
			Agent.getUserByUsername(newUser.name, function (err, user) {
				if (err) throw err;
				if (user) {
					res.json({ success: false, msg: "Agent already exists" });
				} else {

					Agent.adduser(newUser, function (err,data) {
						if (err) {
							res.json({ success: false, msg: "Error while registering Agent" });
							console.log(err);
						}
						else {
							res.json({ success: true, msg: 'Agent Registered Successfully',data:data });
							
						}
					});

				}
			})


		}
	}catch(exe){
		console.log(exe)
	}
});

router.post('/removeagent', function (req, res) {
	
	Agent.remove({_id:ObjectId(req.body.id)},(err,data)=>{
		if(err) throw err;
		
		res.json({success:true,msg:'Agent Deleted'})
	})
})


//Authentication when agent logs in
router.post('/agentlogin', function (req, res) {
	var name = req.body.name;
	var password = req.body.password;

	Agent.findOne({ name: req.body.name }, function (err, user) {
		if (err) throw err;
		if (!user) {
			return res.json({ success: false, msg: 'Username does not found' });
		}
		else if (user) {
			if (req.body.password) {
				Agent.comparePassword(password, user.password, function (err, isMatch) {
					if (err) throw err;


					if (isMatch) {

						Agent.update({name:req.body.name},{login:true},function(err,response){
							if(err) throw err;
						
							var token = jwt.sign({ data: user }, config.secret, { expiresIn: 604800 });
							res.json({
								success: true,
								msg: "User authenticated",
								token: 'JWT ' + token,
								user: {
									name: user.name,
									id: user.id,
									company_Id: user.company_Id
								}
							});
						})

					} else {
						return res.json({ success: false, msg: 'Wrong password' });
					}

				});
			}
		}
	});
});

router.post('/chat/:project_id/:project_name', function (req, res) {
   
	var Chat = new startChat();
	var ip=requestIp.getClientIp(req);
	var msg = [];
	var geo = geoip.lookup("203.82.59.251");
	
     var location={country:geo.country,city:geo.city}
     console.log(location.country)
	
	msg.push({ message: req.body.message, sender: 'customer', time: new Date(),rating:req.body.rating});
	var projectid = req.params.project_id
	

	startChat.find({project_Id:projectid,customer_email:req.body.email,status:'open'},(err,doc)=>{
		if(err) throw err;
		
		if(doc.length == 0 ){
			
			
			Chat.project_Id = projectid;
			Chat.project_name = req.params.project_name;
			Chat.user_name = req.body.name;
			Chat.customer_email = req.body.email;
			Chat.messages = msg;
			Chat.status = "open";
			Chat.location=location,
			Chat.ip = ip;
		    console.log(req.useragent)
			Chat.useragent = req.useragent
			console.log(req.body.rating)
			Chat.save(function (err, data) {
				if (err) throw err;
				var user = {
					"user_name": req.body.name,
					"chat_id": data._id,
					"project_Id":data.project_Id,
					"status":data.status,
					"rating":data.rating
					
				}
				
				io.sockets.in(projectid).emit('new-customer',user)
				if(typeof req.body.agents == 'undefined' || req.body.agents != 'offline'){
					res.cookie('vizz_id', data._id);
				}
				
				res.json(data);

			})
0		}else{
	       
           var message ={
				"$push":
				{
					messages:
					{
						"message": req.body.message,
						"sender": 'customer',
						"time": new Date(),
						"rating":req.body.rating
					}
				}
			}

			startChat.update({_id:doc[0]._id},message,(err,doc)=>{
				if(err) throw err;
				res.send({success:true})
			})
			
		}

	})
	

})





//Insert Messages when of user and agent to chats collection
router.put('/saveMsg/:chat_id', function (req, res) {
	
	// var time = new Date();
	var newdata = {
		"$push":
		{
			messages:
			{
				"message": req.body.message,
				"sender": req.body.sender,
				"time": req.body.time,
				"id":req.body.id,
				"rating":req.body.rating,
				"comment":req.body.comment
			}
			
		}
	}


	startChat.findOne({ "_id": ObjectId(req.params.chat_id)}, function (err, chat) {
		try{

			if(chat != null && chat.status === "close"){
				newdata.status = "open"
				var user = {	
					"user_name": chat.user_name,
					"chat_id": chat._id,
					"project_Id":chat.project_Id,
					"status":chat.status,
					"rating":chat.rating,
					"id":chat.id,
					"comment":chat.comment
				}
				
				io.sockets.in(chat.project_Id).emit('new-customer',user)
			}
			
			startChat.update({ "_id": ObjectId(req.params.chat_id) }, newdata, function (err, data) {
				if (err) return next(err);
				res.json(data);
			})

		}catch(exe){
			console.log(exe)
		}
		
	})

})




//Get Agent based on project name from assignproj collection
router.get('/agentName/:project_id', function (req, res) {
	Agent.find({ assigned_projects: req.params.project_id },{"name":1	}, function (err, agent) {
		if (err) return next(err);
		res.json(agent);
	});
});

router.get('/agents', function (req, res) {
	var token = req.headers['x-access-token'].split(' ')[1]
	var companyId;
	var agentId;
	jwt.verify(token, config.secret, function(err, decoded) {
		companyId = decoded.data.company_Id
		agentId = decoded.data._id 
	})

	Agent.find({"company_Id":companyId,"_id":{$ne:agentId},login:true},{"name":1}, function (err, agents) {
		if (err) return next(err);
		res.json(agents);
	});
});


//Fetching single project with ID
router.get('/id/:project_id', function (req, res, next) {
	
	Project.findOne(req.params.project_id, function (err, project) {
		if (err) return next(err);
		res.json(project);
	});
});


router.get('/project/:name', function (req, res, next) {
	
	Project.findOne({ name: req.params.name }, function (err, post) {
		if (err) return next(err);
		res.json(post);
	});
});

// Send transcript of chat to the email of user

router.post('/email_transcript', function (req, res, next) {
	
	
	
		startChat.findOne({_id:req.body.chat_id}, function (err, chat) {
			if (err) return next(err);

			if(!req.body.download){
				var html = `<html><body> <h1> Chat Conversation with ${chat.project_name} support</h1><br>`
				chat.messages.forEach((message)=>{
					if(message.sender == 'customer'){
						html += '<strong>You :</strong>'+message.message + '<br>'
					}else{
						html += '<strong>Agent :</strong>'+message.message + '<br>'
					}
					
				})
				html += '</body></html>'

				if(!req.body.email){
					return res.json({"success":false,"msg":"Please provide your email inorder to send request"})
				}
				
				const sgMail = require('@sendgrid/mail');
				sgMail.setApiKey('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');
				const msg = {
				to: req.body.email,
				from: "support@vizzlive.com",
				subject: chat.messages[0].message,
				html: html,
				};
				sgMail.send(msg,(err)=>{
					
					if(err){
						return res.json({"success":false,"msg":"Please enter correct email address"})
					}else{
						return res.json({"success":true,"msg":"Email sent successfuly"})
					}
				});

			}else{
					res.send(chat.messages)
			}
			
		});
	

});

// Mail ticket id to the user email
router.post('/email_ticket_details', function (req, res, next) {


		var html = `<html><body> <h1> Thanks for contacting vizzlive support</h1><br>
		Thanks for contacting VizzLive support
		This is an automated message to confirm the successful submition of your request you can 
		follow on your ticket details on this url <a href='https://updatemedaily.com'>Update Me Daily</a><br>`

		if(req.body.guest_password != null){
			html += `<stong>Username :</strong> ${req.body.guest_email}<br>
			<stong>Password :</strong> ${req.body.guest_password}<br>`
		}
		
		html += `<strong>Ticket Id:</strong> ${req.body.ticketid}<br>
		<strong>Support requested for:</strong> ${req.body.project_name} </body></html>`

		if(!req.body.guest_email){
			return res.json({"success":false,"msg":"Please provide your email inorder to send request"})
		}
		
		const sgMail = require('@sendgrid/mail');
		sgMail.setApiKey('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');
		const msg = {
		to: req.body.guest_email,
		from: "support@vizzlive.com",
		subject: "Your ticket for "+ req.body.project_name +" Ticket ID: "+req.body.ticketid,
		html: html,
		};
		sgMail.send(msg,(err)=>{
			
			if(err){
				return res.json({"success":false,"msg":"Please enter correct email address"})
			}else{
				return res.json({"success":true,"msg":"Email sent successfuly"})
			}
		});

});


//Assigning project to agent 
router.put('/assignProj/:project_Id', function (req, res) {
	
	var newdata = {
		"$push":
		{
			assigned_projects: req.params.project_Id

		}
	}
	Agent.update({ "_id": ObjectId(req.body.name) }, newdata, function (err, data) {
		if (err) return next(err);
		res.json({success:true,msg:"Agent assigned successfuly"});
	})
})



router.get('/agentData/:name', function (req, res) {

	Agent.findOne({ name: req.params.name }, {}, function (err, data) {
		if (err) throw err;
		res.json(data)
	})
})


router.post('/assignagent', function (req, res) {

	startChat.update({ _id: ObjectId(req.body.chat_id) },{"status":"taken","agent_id":req.body.agent_id},(err,result)=>{
		res.json({success:true})
	})
})



router.get('/find/:name/',async function (req, res, next) {
	
	var token = req.headers['x-access-token'].split(' ')[1]
	var agentId;
	jwt.verify(token, config.secret, function(err, decoded) {
		agentId = decoded.data._id
		console.log(agentId)
	})
	console.log(req.params.name)
	let data=await Agent.aggregate(
		[
			{
				$match:
				{
					"name": req.params.name

				}
			},
			{
				  $unwind: "$assigned_projects"
			},			
			{
				$lookup:
				{
					from: "chats",
					localField: "assigned_projects",
					foreignField: "project_Id",
					as: "all_chat"
				}

			},
			{ $unwind: "$all_chat" },
			{
				$match: { $or:[{'all_chat.status' : 'open'},{'all_chat.status' : 'taken','all_chat.agent_id':agentId}]}
			},
		
			{"$group":{"_id":"$all_chat._id","doc":{"$first":"$$ROOT"}}},
			{"$replaceRoot":{"newRoot":"$doc"}},
			{
				$project:
				{
					'chat_id': "$all_chat._id",
					'status': "$all_chat.status",
					"chat_projectName": "$all_chat.project_name",
					"project_Id": "$all_chat.project_Id",
					"user_name": "$all_chat.user_name"
				}

			}
		]);
		// let result=Array.from(new Set(data.map(x=>x.chat_id))).map(id=>{return {_id:data.find(s=>s.chat_id===id)._id,chat_id:id,status:data.find(s=>s.chat_id===id).status,chat_projectName:data.find(s=>s.chat_id===id).chat_projectName,project_Id:data.find(s=>s.chat_id===id).project_Id,user_name:data.find(s=>s.chat_id===id).user_name}});
		res.json(data)
});

router.get('/get-assigned-agent/:chatid',(req,res)=>{

	startChat.findOne({_id:ObjectId(req.params.chatid)}, function (err, chat) {
		if(err) throw err;

		Agent.findOne({_id:ObjectId(chat.agent_id)},{name:1}, function (err, data) {
			if(err) throw err;
			
			res.json(data)
		})
	})

})

router.put('/updateChatStatus/:project_name', function (req, res) {
	startChat.findOneAndUpdate({ project_name: req.params.project_name }, { $set: { "status": "1" } }, function (err, data) {
		if (err) throw err;
		res.json(data)
	})
})

router.put('/closeChat/:chat_Id', function (req, res) {

	startChat.updateMany({ _id: req.params.chat_Id },{ "status": "close" }, function (err, data) {
		if (err) throw err;
		res.json(data)
	})
})


//get user data when agent selects a chat and display on chat board

router.get('/get_customer_data/:chat_Id', function (req, res) {
	startChat.findOne({ _id: ObjectId(req.params.chat_Id) }, {"customer_email":1,"project_name":1,"user_name":1,"status":1,"project_Id":1,"ip":1,"location":1}, function (err, data) {
		if (err){ return next(err);}

		res.json(data);
	})

})

router.post('/transferchat', function (req, res) {

	startChat.update({ _id: ObjectId(req.body.chat_id) },{'agent_id':req.body.agent_id}, function (err, data) {
		if (err) return next(err);
		
		res.json({success:true,messae:"Data updated successfuly"});
	})
})


router.post('/get-customer-data', function (req, res) {
	
	var projection;
	if(req.body.email == ''){
		projection = [
				{ 
					$match: { 
						'agent_id': {$ne:null}
					}
				},
				{ 
				$project: {
					messages:1,
					agent:{
						$convert:{
							input:"$agent_id", 
							to:"objectId", 
							onError:"Cannot $convert to objectId"
						}
					},
					user_name:1,
					project_name:1
				}
				},
				{
					$lookup:
					{
						from : 'agents',
						localField : "agent",
						foreignField : "_id",
						as : 'agent'
					}
				},
				{
					$project:{
						"agent.name":1,
						"messages":1,
						"user_name":1,
						"project_name":1
					}
				}
			]
		}else{
			projection = [
				{ 
				$match: { 
					'customer_email': req.body.email 
				}
				},
				{ 
				$project: {
					messages: 1,
					agent:{
						$convert:{
							input:"$agent_id", 
							to:"objectId", 
							onError:"Cannot $convert to objectId"
						}
					},
					user_name:1,
					project_name:1
				}
				},
				{
					$lookup:
					{
						from : 'agents',
						localField : "agent",
						foreignField : "_id",
						as : 'agent'
					}
				},
				{
					$project:{
						"agent.name":1,
						"messages":1,
						"user_name":1,
						"project_name":1
					}
				}
			]
		}
	
	startChat.aggregate(projection, function (err, data) {
		if (err) console.log(err);
		
		res.json({success:true,data:data})
	})
	
})


router.post('/assigned-projects', function (req, res) {

	try{
		Agent.findOne({_id:ObjectId(req.body.agent_id)},{"assigned_projects":1,_id:0}, function (err, data) {
			if (err) return next(err);
			
			if(typeof data.assigned_projects != 'undefined'){
				var array = []
				data.assigned_projects.forEach((projectid)=>{
					array.push(projectid)
				})

				Project.find({_id:{$in:array}},{name:1,url:1,_id:0},(err,projects)=>{
					res.json({success:true,data:projects});
				})
			}else{
				res.json({success:false})
			}
			
		})
	}catch(exe){
		console.log(exe)
	}
})


router.post('/update-colors', function (req, res) {

	Project.update({ _id: ObjectId(req.body.project_id) },{'primarycolor':req.body.primarycolor,'secondarycolor':req.body.secondarycolor}, function (err, data) {
		if (err) return next(err);
		res.json({success:true,messae:"Data updated successfuly"});
	})
})

router.get('/get-project/:id',(req,res)=>{
	Project.findOne({_id:req.params.id},(err,project)=>{
		if(err) throw err;

		try{
			res.send(project)
		}catch(exe){
			console.log(exe)
		}
		
	})
})


router.get('/getVisitors/:skip',async (req,res)=>{

	var skip = (req.params.skip != '') ? parseInt(req.params.skip) : 0;
	var limit = 20;
	if(skip > 1){
            var offset = limit * (skip);
      }else{
            var offset = 0;
	 }
	 

	 const [ record, count ] = await Promise.all([
            startChat.find({}).skip(skip).limit(parseInt(limit)),
            startChat.count({})
    
        ]);

       const total_count = (typeof count !== 'undefined')?count:0;
        const pageCount = Math.ceil(total_count / limit);
        res.json({
            data:paginate.getArrayPages(req)(pageCount, pageCount, skip),
            record,pageCount
        });

})



router.get('/getVisitor/:visitorId',async (req,res)=>{

	var id = req.params.visitorId;
	startChat.findOne({_id:id},function(err,visitorDetail){
		
		if(err) throw err;
		res.json(visitorDetail)
	
	})

})
router.post('/tickets', async (req, res) => {
    const ticket=new addTicket(req.body) 
    const addticket=await ticket.save();  
     res.status(200).json({message:"Ticket add successfully"})
});




module.exports = router;




