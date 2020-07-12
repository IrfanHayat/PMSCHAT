const express = require('express');
const router = express.Router();
const {addDigiebotUsers} = require('../models/digiebotInfo');


router.post('/addUser', async (req, res) => {
    
    
    const addUser=new addDigiebotUsers(req.body)
    
    const loginUser=await addUser.save();

     res.status(200).json(loginUser)
  
});

router.get('/getUser/:id',async (req,res)=>{
    let get_user=await addDigiebotUsers.findOne({id:req.params.id})
    res.json({get_user})
    
})







module.exports = router






