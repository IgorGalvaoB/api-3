const User = require('../../models/User.model.js');

const verifyCredentials = async (userId,id) => {

    if(id === userId){

        return

    } else {
        
        const friend = await User.findById({_id:userId}).select('friends');
        if(friend.friends.includes(id)){

            return

        } else {

            const error = new Error();
            error.status = 401;
            error.message = "You can't do this action";
            throw error

        }

    }

};

module.exports = verifyCredentials