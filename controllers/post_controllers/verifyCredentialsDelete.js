const verifyCredentialsDelete = async (user, post) => {
    console.log(user,post)
    if(user !== post.postBy){
        console.log(user.posts)
        /* if(user.posts.includes(post)){

            return;

        } else {
                
                const error = new Error;
                error.status = 401;
                error.message = "You can't delete this post";
                throw error;
    
        } */

    }
    return
}
module.exports = verifyCredentialsDelete;
