const User = require('../../models/User.model.js');

const verifyExist = async (email, username) => {

    const emailFromDb = await User.findOne( {email:  email } )
    const usernameFromDb = await User.findOne( {username:  username } )
    if(emailFromDb) {

        const error = new Error();
        error.status = 409;
        error.message = "Email already exist";
        throw error;
        
    }
    if(usernameFromDb) {

        const error = new Error();
        error.status = 409;
        error.message = "Username already exist";
        throw error;
        
    }
  
    return

  }
  
module.exports = verifyExist