const { Router } = require('express');
const user = require('../models/User.model.js');
const router = Router();


router.get('/find/:username', async (req,res)=>{
    try {
        const getUser = await user.findOne({username:req.params.username})
        console.log(getUser)
        res.status(200).json(getUser)
    } catch (error) {
        res.status(401).json({place:"Error on find user",error:error.message})
    }
    
})

module.exports = router