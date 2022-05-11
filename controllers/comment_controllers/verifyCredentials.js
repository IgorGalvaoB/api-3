const User = require('../../models/User.model.js');

const verifyCredentials = async (comment, userId) => {

    if(comment.by.toString() === userId){
    
        return
        
    }
    
    const user = await User.findOne({_id:userId,$or:[{posts:comment.commentedAt},{photos:comment.commentedAt},{coverImage:comment.commentedAt},{profileImage:comment.commentedAt}]});
    
    if(user)return
        
    const error = new Error;
    error.status = 401;
    error.message = "Invalid credentials";
    throw error; 
    
}

module.exports = verifyCredentials;