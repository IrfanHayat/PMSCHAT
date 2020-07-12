'use strict';
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Agent = require('../models/agent');


//Register Agent
router.post('/addagent/:company_Id', function (req, res) {

	var newUser = new Agent();
	newUser.name = req.body.name;
	newUser.password = req.body.password;
	newUser.company_Id = req.params.company_Id;

	if (req.body.name == null || req.body.name == '' || req.body.password == null || req.body.password == '') {
		res.json({ success: false, message: 'ensure fields are filled' });
	}
	else {
		Agent.getUserByUsername(newUser.name, function (err, user) {
			if (err) throw err;
			if (user) {
				res.json({ success: false, message: "Agent already exists" });
				res.redirect('/agent/' + newUser.company_Id);
				// res.end();
			} else {

				Agent.adduser(newUser, function (err) {
					if (err) {
						res.json({ success: false, message: "Error while registering Agent" });
						console.log(err);
					}
					else {
						res.json({ success: true, message: 'Agent Registered Successfully' });
						console.log(newUser);
					}
				});

			}
		})


	}
});

//Authentication when agent logs in
router.post('/agentlogin', function (req, res) {
	var name = req.body.name;
	var password = req.body.password;

	Agent.findOne({ name: req.body.name }, function (err, user) {
		if (err) throw err;
		if (!user) {
			return res.json({ success: false, msg: 'User not found' });


		}
		else if (user) {
			if (req.body.password) {
				Agent.comparePassword(password, user.password, function (err, isMatch) {
					if (err) throw err;


					if (isMatch) {

						var token = jwt.sign({ data: user }, config.secret, { expiresIn: 604800 });
						res.json({
							success: true,
							message: "User authenticated",
							token: 'JWT ' + token,
							user: {
								name: user.name,
								id: user.id,
								company_Id:user.company_Id
							}
						});
						console.log(user);
						console.log(token)
					} else {
						return res.json({ success: false, msg: 'Wrong password' });
					}

				});
			}
		}
	});
});

router.get('/getAgent',async (req,res)=>{
	let agent=await Agent.find({})
	res.json({agent})
})


module.exports = router;