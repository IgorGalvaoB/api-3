const { Router } = require('express');
const router = Router();
const uploadCloud = require('../config/cloudinary.config.js');
const User = require('../models/User.model.js');
const Post = require('../models/Post.model.js');
const verifyCredentials = require('../controllers/post_controllers/verifyCredentials.js');
const verifyCredentialsDelete = require('../controllers/post_controllers/verifyCredentialsDelete.js');


router.post('/:id',uploadCloud.array('image'),async (req, res) => {

    const { id } = req.params;
    const { text } = req.body||null;
    const files = req.files;
    
    try {
        const images = [];

        await verifyCredentials(req.id,id)

        if(files){
            files.forEach(file=>{
                images.push(file.path)
            })
        }
        if(!text && images.length===0){

            const error = new Error;
            error.status = 400;
            error.message = "You must write something or upload an image";
            throw error;
            
        }

        const newPost = await Post.create({

            postBy: req.id,

        })

        if(text){

            newPost.content = text;

        }

        if(images.length>0){

            newPost.imagesUrl = images;

        }

        await newPost.save();
        await User.findByIdAndUpdate(id, { $push: { posts: newPost._id } });
        
        res.status(200).json({ message: 'Post created' });
        
    } catch (error) {
            
            res.status(400 || error.status).json({ place: "Error on post creation", error: error.message })
            
    }

})

router.delete('/delete/:id',async (req,res)=>{

    const { id } = req.params;
   
    const  postedAt  = req.id;

    try {

        const user = await User.findById(postedAt).select('posts');
        console.log(user)
        const post = await Post.find({_id:{$in:user.posts},_id:id,count:{$gt:0}});
      
        
        await verifyCredentialsDelete(post,postedAt,req.id)

        const index = user.posts.indexOf(post._id);
        user.posts.splice(index,1);

        await user.save();
        await Post.findByIdAndDelete(id);

        res.status(200).json({ message: 'Post deleted' });

    } catch (error) {
        
        res.status(400 || error.status).json({ place: "Error on post deletion", error: error.message })
        
    }


})
module.exports = router;