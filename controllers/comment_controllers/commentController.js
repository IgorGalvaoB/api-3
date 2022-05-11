const Post = require('../../models/Post.model.js');
const Image = require('../../models/Image.model.js');

const commentControler = async (id, type) =>{

    if(type==='post'){
            
            const post = await Post.findById(id);

            if(!post){

                const error = new Error;
                error.status = 404;
                error.message = "Post not found";
                throw error;

            }
    
            return post
    
    } else {
        
        const image = await Image.findById(id);
        
        if(!image){

            const error = new Error;
            error.status = 404;
            error.message = "Image not found";
            throw error;

        }

        return image
        


    }

}

module.exports = commentControler;