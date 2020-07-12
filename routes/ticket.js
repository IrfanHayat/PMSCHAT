const express = require('express');
const router = express.Router();
const {addTicket , validateTicket} = require('../models/addticket');



router.post('/tickets', async (req, res) => {
    const { error } = validateTicket(req.body);
    res.status(500).send(error) 
    const ticket=new addTicket(req.body) 
    const addticket=await ticket.save();  
     res.status(200).send(addticket)
});


module.exports = router






