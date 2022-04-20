const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Router } = require('express');
const User = require('../models/User.model.js');
const authReq = require('../controllers/auth_controllers/authReq');
const verifyExist = require('../controllers/auth_controllers/verifyExist');
const validateInputs = require('../controllers/auth_controllers/validateInputs');


const router = Router();


router.post('/signup', async (req, res) => {

    const { username, email, password } = await authReq(req)

    try {
        validateInputs(email, password, username)
        await verifyExist(email, username)
        const salt = await bcrypt.genSalt(12);
        hPassword = await bcrypt.hash(password, salt);
        await User.create({
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
router.post('/login', async (req, res) => {})

module.exports = router;