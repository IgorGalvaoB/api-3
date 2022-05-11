const User = require('../models/User.model');
const Messages = require('../models/Message.model');
const Conversations = require('../models/Conversation.model');
const { Router } = require('express');
const router = Router();

router.get('/getConversations/:username', async(req, res) => { 
    const { username } = req.params;
  
    try {
        const user = await User.findOne({username:username}).select('conversations');
        console.log(user)   
        const conversations = await Conversations.find({_id:{$in:user.conversations}}).sort({updatedAt: 1}).populate({

            path: 'conversationWith',
            populate:{
                path:'profileImage',
                options:{
                    select:'imageUrl'
                }
            },
            options:{
                select:'username name _id profileImage'
            }
            
        }).populate({
            path:'lastMessage',
            options:{
                select:'content sender',
            }
        }).select('conversationWith lastMessage').sort({updatedAt: -1});
        res.status(200).json(conversations);

    } catch (error) {
        
        res.status(error.status || 400).json({ place: "Error on getConversations", error: error.message })

    }

});
router.get('/getMessages/:id',async(req, res) => {

        const {id} = req.params;

        try {

            const messages = await Conversations.findOne({user:req.id,conversationWith:id}).populate({
                path: 'messages',
                options:{
                    sort:{
                        createdAt:1,
                    }
                }
            })

            res.status(200).json(messages);
            
        } catch(error) {
            console.log(error)
            res.status(error.status || 400).json({ place: "Error on getMessages", error: error.message })
        }
})

module.exports = router;

