const { Router } = require('express');
const router = Router();
const User = require('../models/User.model.js');
const bcrypt = require('bcrypt');
const verifyCredentials = require('../controllers/user_controllers/verifyCredentials.js');


router.post('/password/:id', async (req, res) => {

    const { id } = req.params;
    const { password, newPassword } = req.body;
    const salt = await bcrypt.genSalt(12);
    const hPassword = await bcrypt.hash(newPassword, salt);
    
    verifyCredentials(id, req.id)


    try {
        if (password === newPassword) {

            const error = new Error;
            error.status = 400;
            error.message = "New password must be different from the old one";
            throw error;

        }
        const user = await User.findById(id);

        const isMatch = await bcrypt.compare(password, user.hPassword);

        if (!isMatch) {

            const error = new Error
            error.status = 401
            error.message = "password is incorrect"
            throw error

        }

        user.hPassword = hPassword;
        user.save();

        res.status(200).json({ message: 'Password updated' });

    } catch (error) {

        res.status(400 || error.status).json({ place: "Error on password", error: error.message })

    }


})

router.post('/requestFriend/:id', async (req, res) => {

        const userId = req.id;
        const  friendId  = req.params.id;

    try {

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (user.requestFriends.indexOf(friendId) !== -1) {

            const error = new Error;
            error.status = 400;
            error.message = "Friend already requested you";
            throw error;

        } 
        if(user.friends.indexOf(friendId) !== -1){
                
                const error = new Error;
                error.status = 400;
                error.message = "You are already friends";
                throw error;
    
        }
        if(friend.requestFriends.indexOf(userId) !== -1){

            const error = new Error;
            error.status = 400;
            error.message = "You already requested this user";
            throw error;

        }

        friend.requestFriends.push(user._id);
        
        await friend.save();

        res.status(200).json({ message: 'Friend request sent' });

    } catch (error) {

        res.status(400 || error.status).json({ place: "Error on friend request", error: error.message })

    }

})

router.post('/acceptFriend/:id', async (req, res) => {

    const friendId = req.params.id;
    const userId = req.id;

    try {

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);
        if(user.friends.indexOf(friendId) !== -1){
                
                const error = new Error;
                error.status = 400;
                error.message = "You are already friends";
                throw error;
    
        }

        user.friends = [...user.friends, friendId];
        friend.friends = [...friend.friends, userId];

        const indexUser = user.requestFriends.indexOf(friendId);
        const indexFriend = friend.requestFriends.indexOf(userId);

        user.requestFriends.splice(indexUser, 1);
        friend.requestFriends.splice(indexFriend, 1);

        await user.save();
        await friend.save();

        res.status(200).json({ message: 'Friend accepted' });

    } catch (error) {

        res.status(400 || error.status).json({ place: "Error on friend accept", error: error.message })

    }


})

router.post('/changeUsername/:id', async (req, res) => {

    const { id } = req.params;
    const { username } = req.body;
    
    try {
        verifyCredentials(id, req.id);

        const alreadyExist = await User.find({ username: username });
        
        if(alreadyExist.length > 0){

            const error = new Error;
            error.status = 400;
            error.message = "Username already exists";
            throw error;

        }

        const user = await User.findById(id);
        user.username = username;
        await user.save();

        res.status(200).json({ message: 'Username updated' });

    } catch (error) {

        res.status(400 || error.status).json({ place: "Error on username update", error: error.message })

    }


})

router.get('/findUser/:username', async (req, res) => {

    const { username } = req.params;
    console.log(username);

    try {

        const user = await User.findOne({ username: username })
        .populate('profileImage')
        .populate('coverImage')
        .populate({
            path:'friends',
            perDocumentLimit:9
        })
        .populate({
            path:'photos',
            perDocumentLimit:9,
        })
        /* .populate({
            path:'posts',
            perDocumentLimit:10,
        }) */.select({hPassword:0,email:0})
        

        if(user){

            res.status(200).json({ user: user });

        } else {

            const error = new Error;
            error.status = 404;
            error.message = "User not found";
            throw error;

        }

    } catch (error) {

        res.status(400 || error.status).json({ place: "Error on find user", error: error.message })

    }


})

router.get('/findUsers/:name', async (req, res) => {

})

module.exports = router;