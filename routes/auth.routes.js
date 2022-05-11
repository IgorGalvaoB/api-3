const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Router } = require('express');
const User = require('../models/User.model.js');
const verifyExist = require('../controllers/auth_controllers/verifyExist');
const validateInputs = require('../controllers/auth_controllers/validateInputs');

const router = Router();

router.post('/signup', async (req, res) => {

    const { username, email, password, name } = req.body
 
    try {

        validateInputs(email, password, username, name)
        await verifyExist(email, username)
        const salt = await bcrypt.genSalt(12);
        hPassword = await bcrypt.hash(password, salt);

        await User.create({

            name,
            username,
            email,
            hPassword,

        })

        const newUser = {

            username: username,
            email: email,

        }

        res.status(201).json(newUser)

    } catch (error) {

        res.status(error.status || 400).json({ place: "Error on signup", error: error.message })

    }

})


router.post('/login', async (req, res) => {
    
        const { email, password, remember } = req.body
        
        try {   
            
            const user = await User.findOne({ email: email })

            if (!user) {

                const error = new Error
                error.status = 401
                error.message = "Email or password is incorrect"
                throw error

            }

            const isMatch = await bcrypt.compare(password, user.hPassword);

            if (!isMatch) {

                const error = new Error
                error.status = 401
                error.message = "Email or password is incorrect"
                throw error

            }
            const payload = {

                id: user._id,
                username: user.username,
            }

            let token;

            if(remember){
                
                token = jwt.sign(payload, process.env.SECRET);

            }else{

                token = jwt.sign(payload, process.env.SECRET, { expiresIn: '6h' });

            }

            res.status(200).json({username:user.username, token:token,user:user._id});
    
        } catch (error) {
    
            res.status(error.status || 400).json({ place: "Error on login", error: error.message })
    
        }
    
})
module.exports = router;