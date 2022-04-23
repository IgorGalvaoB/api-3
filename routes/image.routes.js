const { Router } = require('express');
const router = Router();
const uploadCloud = require('../config/cloudinary.config.js');
const User = require('../models/User.model.js');
const Image = require('../models/Image.model.js');
const verifyCredentials = require('../controllers/image_controllers/verifyCredentials');
const deleteOldImage = require('../controllers/image_controllers/deleteOldImage');

router.put('/profileImage/:id',  uploadCloud.single('image'),  async (req, res) => {

    const { id } = req.params;
    const { path } = req.file|| 'aaa';

    try {
        
        verifyCredentials(id,req.id)
        const user = await User.findById(id,{avatarImage:1});
        const newImage = await Image.create({imageUrl:path});
        await deleteOldImage(user.avatarImage);
        user.avatarImage = newImage._id;
        await user.save();
        
        res.status(200).json({ message: 'Image updated' }); 
        
    } catch (error) {

        res.status(error.status || 400).json({

            place: "Error on profile image",
            error: error.message

        });

    }

})

router.put('/coverImage/:id',  uploadCloud.single('image'),  async (req, res) => {

    const { id } = req.params;
    const { path } = req.file|| 'aaa';

    try {
        
        verifyCredentials(id,req.id)
        const user = await User.findById(id,{coverImage:1});
        const newImage = await Image.create({imageUrl:path});
        await deleteOldImage(user.coverImage);
        user.coverImage = newImage._id;
        await user.save();
        
        res.status(200).json({ message: 'Image updated' }); 
        
    } catch (error) {

        res.status(error.status || 400).json({

            place: "Error on cover image",
            error: error.message

        });

    }

})








































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