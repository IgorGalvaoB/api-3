const { Router } = require('express');
const router = Router();
const uploadCloud = require('../config/cloudinary.config.js');
const User = require('../models/User.model.js');
const Image = require('../models/Image.model.js');
const verifyCredentials = require('../controllers/image_controllers/verifyCredentials');
const deleteOldImage = require('../controllers/image_controllers/deleteOldImage');

router.put('/profileImage/:id',  uploadCloud.single('image'),  async (req, res) => {

    const { id } = req.params;
    const { path } = req.file;
   
    
    try {

        if(!path){

            const error = new Error;
            error.status = 400;
            error.message = "No image selected";
            throw error;

        }
        
        verifyCredentials(id,req.id)
        const user = await User.findById(id);
        const newImage = await Image.create({imageUrl:path});
        await deleteOldImage(user.profileImage);
        user.profileImage = newImage._id;
        
        await user.save();
        
        res.status(200).json({ message: 'Image updated' }); 
        
    } catch (error) {

        res.status(error.status || 400).json({

            place: "Error on upload image",
            error: error.message

        });

    }

})

router.put('/coverImage/:id',  uploadCloud.single('image'),  async (req, res) => {

    const { id } = req.params;
    const { path } = req.file;
   
    
    try {

        if(!path){

            const error = new Error;
            error.status = 400;
            error.message = "No image selected";
            throw error;

        }
        
        verifyCredentials(id,req.id)
        const user = await User.findById(id);
        const newImage = await Image.create({imageUrl:path});
        await deleteOldImage(user.coverImage);
        user.coverImage = newImage._id;
        
        await user.save();
        
        res.status(200).json({ message: 'Image updated' }); 
        
    } catch (error) {

        res.status(error.status || 400).json({

            place: "Error on upload image",
            error: error.message

        });

    }

})


router.put('/photos/:id',uploadCloud.array('image'),async(req,res)=>{

    const { id } = req.params;
    const  files  = req.files
    
    try {
       
        if(files.length === 0){

            const error = new Error;
            error.status = 400;
            error.message = "No image selected";
            throw error;

        }
        
        verifyCredentials(id,req.id)
        const user = await User.findById(id);

        for(let i=0;i<files.length;i++){
           
            const newImage = await Image.create({imageUrl:files[i].path})
            user.photos.push(newImage._id);
        }

        user.save();
        res.status(200).json({ message: 'Images updated' }); 
        
    } catch (error) {

        res.status(error.status || 400).json({

            place: "Error on upload images",
            error: error.message

        });

    }

});

router.get('/userPhotos/:id',async(req,res)=>{
    
        const { id } = req.params;
        //const { limit, offset } = req.body;
    
        try {
    
            const user = await User.findById(id);
            const images = await Image.find({_id:{$in:user.photos}})
            .sort({createdAt:-1})
            .select({ imageUrl:1,_id:1 })
            //.skip(offset)
            //.limit(limit);

            res.status(200).json({ images: images }); 
    
        } catch (error) {
    
            res.status(error.status || 400).json({
    
                place: "Error on get images",
                error: error.message
    
            });
    
        }
    
})

router.get('/photo/:id',async(req,res)=>{

    const { id } = req.params;

    try {

        const image = await Image.findById(id).populate({
            path:'comments',
            sort:{createdAt:1},
        }).select('imageUrl comments');
        
        res.status(200).json({ image: image }); 

    } catch (error) {

        res.status(error.status || 500).json({

            place: "Error on get image",
            error: error.message

        });

    }


})

router.delete('/delete/:userId',async(req,res)=>{

    const { userId } = req.params;
    const { type, imageId } = req.body;
    
   
    if(type === 'profileImage' || type === 'coverImage'){

        try {
            
            verifyCredentials(userId,req.id)
            const user = await User.findById(userId);
            await deleteOldImage(user[type]);
            user[type] = null;
            await user.save();

            res.status(200).json({ message: 'Image deleted' });

        } catch ( error ){
                
                res.status(error.status || 400).json({
        
                    place: "Error on delete image",
                    error: error.message
        
                });
        
        }
    }else{
           
            try {
                
                verifyCredentials(userId,req.id)
                const user = await User.findById(userId);
                if(user.photos.indexOf(imageId) !== -1){

                    const image = await Image.findByIdAndDelete(imageId);
                    user.photos.pull(imageId);
                    await user.save();

                } else {

                    const error = new Error
                    error.status = 404
                    error.message = "Image not found"
                    throw error

                }
                res.status(200).json({ message: 'Image deleted' });
    
            } catch ( error ){
                    
                    res.status(error.status || 400).json({
            
                        place: "Error on delete image",
                        error: error.message
            
                    });
            
            }
    }

});










































/* const { Router } = require('express');
const router = Router();
const uploadCloud = require('../config/cloudinary.config.js');
const User = require('../models/User.model.js');
const Image = require('../models/Image.model.js');
router.post('/:id/uploadImage',uploadCloud.single('image'), async (req, res) => {
    const { id }=req.params
    const { path } = req.file;
    const { text } = req.body;
    console.log(text)
    try {
        const newImage = await Image.create({
            imageUrl: path,
        })
        const userOldImage = await User.findById(id).select('avatarImage')
        if(userOldImage.avatarImage){
            await Image.findByIdAndDelete(userOldImage.avatarImage)
        }
        const userUpdated = await User.findByIdAndUpdate(id, {avatarImage:newImage},{new:true})
        res.status(200).json(userUpdated)
    } catch (error) {
        res.status(500).json({place:"Error on upload image",error:error.message})
    }

}) 
router.delete('/:id/deleteImage', async (req, res) => {
    const { id } = req.params;
    try {
        const image = await User.findById(id)
        await Image.findByIdAndDelete(image.avatarImage)
        image.avatarImage = 1
        await image.save()
        console.log(image)
        //await image.remove()
        res.status(200).json('funfou')
    } catch (error) {
        res.status(500).json({place:"Error on delete image",error:error.message})
    }
})
/* router.get('/find/:username', async (req,res)=>{
    try {
        const getUser = await user.findOne({username:req.params.username})
        console.log(getUser)
        res.status(200).json(getUser)
    } catch (error) {
        res.status(401).json({place:"Error on find user",error:error.message})
    }   
})
 */

module.exports = router; 