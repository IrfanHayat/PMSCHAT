'use strict';
const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Agent = require('../models/agent');



//Authenticate Comapny
router.post('/agentlogin', function (req, res) {
	var name = req.body.name;
	var password = req.body.password;

	Agent.getUserByUsername(name, function (err, user) {
		if (err) throw err;
		if (!user) {
			return res.json({ success: false, msg: 'User not found' });


		}
		else if (user) {
			if (req.body.password) {
				Agent.comparePassword(password, user.password, function (err, isMatch) {
					if (err) throw err;


					if (isMatch) {

						var token = jwt.sign({data:user},config.secret,{expiresIn:604800});
						res.json({
						 	success: true,
						 	message: "User authenticated",
						 	token:'JWT ' + token, 
						 	 user: {
                                name: user.name, 
							 	id: user.id, 
							 	company_Id: 
								user.company_Id 
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

// Profile
router.get('/agent-board', passport.authenticate('jwt', { session: false }), (req, res, next) => {
	console.log(req.user)
	res.json({ user: req.user });
});

module.exports = router;