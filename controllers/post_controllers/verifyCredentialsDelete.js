const verifyCredentialsDelete = async (post, postedAt, userTryingDelete) => {
    if(post.length === 0){

        const error = new Error;
        error.status = 400;
        error.message = "Post not found";
        throw error;

    }

    if(post.postBy !== userTryingDelete){
        
        if(userTryingDelete === postedAt){
            
            return;

        } else {

            const error = new Error;
            error.status = 401;
            error.message = "You can't delete this post";
            throw error;

        }
        
    }

    return;

}
module.exports = verifyCredentialsDelete;
