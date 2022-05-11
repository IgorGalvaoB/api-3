const { Router } = require('express');
const router = Router();
const User = require('../models/User.model.js');
const bcrypt = require('bcrypt');
const verifyCredentials = require('../controllers/user_controllers/verifyCredentials.js');
const controlUsers = require('../controllers/user_controllers/controlUsers.js');


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
    const friendId = req.params.id;

    try {

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (user.requestFriends.indexOf(friendId) !== -1) {

            const error = new Error;
            error.status = 400;
            error.message = "Friend already requested you";
            throw error;

        }
        if (user.friends.indexOf(friendId) !== -1) {

            const error = new Error;
            error.status = 400;
            error.message = "You are already friends";
            throw error;

        }
        if (friend.requestFriends.indexOf(userId) !== -1) {

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
        console.log(user)
        const friend = await User.findById(friendId);
        console.log(friend)
    
        if (user.friends.indexOf(friendId) !== -1) {

            const error = new Error;
            error.status = 400;
            error.message = "You are already friends";
            throw error;

        }

        user.friends = [...user.friends, friend._id];
        friend.friends = [...friend.friends, user._id];

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

router.post('/changeName/:id', async (req, res) => {

    const { id } = req.params;
    const { name } = req.body;

    try {

        verifyCredentials(id, req.id);
        const user = await User.findById(id);
        user.name = name;
        await user.save();

        res.status(200).json({ message: 'Name updated' });

    } catch (error) {

        res.status(400 || error.status).json({ place: "Error on change name", error: error.message })

    }

})

router.post('/changeUsername/:id', async (req, res) => {

    const { id } = req.params;
    const { username } = req.body;

    try {
        verifyCredentials(id, req.id);

        const alreadyExist = await User.find({ username: username });

        if (alreadyExist.length > 0) {

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

    const id = req.id;

    try {
        const user0 = await User.findById(id);

        let user = await User.findOne({ username: username })
            .populate({ 
                path: 'friends',
                populate: {
                    path: 'profileImage',
                },
                options:{
                    select: 'username name _id profileImage',
                    sort:{name:1,_id:1}
                }
            })
            .populate({
                path: 'profileImage',
                select: '_id imageUrl'
            })
            .populate({
                path:'coverImage',
                select: '_id imageUrl'
            })
            .populate({
                path: 'photos',
                options:{
                    sort:{createdAt:-1},
                    select: '_id imageUrl'
                }
            })
            .populate({
                path: 'posts',
                populate: {
                    path: 'comments',
                    populate: {
                        path: 'by',
                        populate:{
                            path:'profileImage',
                        },
                        select:'username name _id profileImage'
                        
                    }
                },
                options:{
                    sort:{createdAt:-1},
                }
              
            }).select({ hPassword: 0, email: 0 })
            
            const relationship = ()=>{
               
                if(user._id.toString() === req.id.toString()){
                    
                    return 'self'
                }
                const userRequests = user.requestFriends.map(request=>{
                    if(request){
                        return request.toString()
                    }
                    return
                });
                
                const userFriends = user.friends.map(friend=>{
                    console.log(friend._id.toString(),req.id)
                    return friend._id.toString()
                });
                
                const user0Requests = user0.requestFriends.map(request=>{
                    return request.toString()
                })
                
                if(userFriends.indexOf(req.id)!==-1){
                    return 'friend'
                }
                if(userRequests.indexOf(req.id)!==-1){
                    return 'requested'
                }
                if(user0Requests.indexOf(user._id.toString())!==-1){
                    return 'requested you'
                }
                return 'none'
            }
            const isFriend = relationship();
        if (user) {

            res.status(200).json({ user: user, isFriend: isFriend });

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

router.get('/findUsers/:query', async (req, res) => {

    const { query } = req.params;
    let { skip, limit } = req.body;

    if (!skip || !limit) {

        skip = 0;
        limit = 8;

    }

    try {

        if (query.length <= 0) {

            const error = new Error;
            error.status = 400;
            error.message = "Query is empty";
            throw error;

        }

        const user = await User.findOne({ _id: req.id })

        const exactUsername = await User.findOne({ 
                username: query, 
                _id: { $ne: req.id },
                count:{$gt:0} 
            }).populate({
                path:'profileImage',
                options:{
                    select:'_id imageUrl'
                }
            }).select({
                username: 1,
                name: 1,
                profileImage: 1,
                friends: 1,
            });
        
        const friends = await User.find({
            name: {
                $in: user.friends,
                $regex: `^${query}+`,
                $options: 'i',
            },
            count: { $gt: 0 },
        }).populate({
            path:'profileImage',
            options:{
                select:'_id imageUrl'
            }
        }).select('friends username name profileImage _id');

        const notFriends = await User.find({
            name: { $regex: `^${query}+`, $options: 'i' },
            _id: { $ne: user._id, $nin: user.friends },
            count: { $gt: 0 },
        }).populate({
            path:'profileImage',
            options:{
                select:'_id imageUrl'
            }
        }).select({
            username: 1,
            name: 1,
            profileImage: 1,
            _id: 1,
            friends: 1,
        }).skip(skip).limit(limit);

        const users = controlUsers(exactUsername, friends, notFriends);

        if (skip !== 0) {

            if (users.length === 2) {

                const error = new Error();
                error.status = 404;
                error.message = "Users not found";
                throw error;

            }

            res.status(200).json({ users: users.slice(2) });

        } else {

            res.status(200).json({ users: users });

        }
    } catch (error) {

        res.status(error.status || 500).json({ place: "Error on find users", error: error.message })

    }

})

router.get('/getUserFriends/:id', async (req, res) => {

    const { id } = req.params;

    try {

        const user = await User.findById(id).populate({
            path: 'friends',
            options: {
                select: 'username name _id profileImage',
                sort:{name:1,username:1}
            },
        }).select('friends');

        if (user) {

            res.status(200).json({ friends: user.friends });

        } else {

            const error = new Error;
            error.status = 404;
            error.message = "User not found";
            throw error;

        }

    } catch (error) {

        res.status(400 || error.status).json({ place: "Error on get user friends", error: error.message })

    }


})

module.exports = router;