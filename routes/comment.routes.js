const { Router } = require('express');
const router = Router();
const commentController = require('../controllers/comment_controllers/commentController');
const verifyCredentials = require('../controllers/comment_controllers/verifyCredentials');
const Comment = require('../models/Comment.model.js');
const User = require('../models/User.model.js');

router.post('/create/:id',async(req,res)=>{

    const { id } = req.params;
    const { content, type } = req.body;
    
    try{

        const user = await User.findById(req.id);
        
        const commentedAt = await commentController(id,type);

        const newComment = await Comment.create({

            by: user._id,
            content: content,
            commentedAt:commentedAt._id,

        });
        
        commentedAt.comments.push(newComment._id);
        await commentedAt.save();

        res.status(200).json({ message: 'Comment created' });

    }catch(error){

        res.status(400 || error.status).json({ place: "Error on comment creation", error: error.message })

    }

});

router.delete('/delete/:id', async (req, res) => {
    
    const { id } = req.params;

    try {
        
        const comment = await Comment.findById(id);
    
        
        if (!comment) {
            
            const error = new Error;
            error.status = 404;
            error.message = "Comment not found";
            throw error;
            
        }
        
        await verifyCredentials(comment, req.id); 
        
        await comment.remove();

        res.status(200).json({ message: 'Comment deleted' });


    } catch (error) {

        res.status(400 || error.status).json({ place: "Error on comment deletion", error: error.message })

        
    }
    
    
})

module.exports = router;