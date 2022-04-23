const User = require('../../models/User.model.js');

const verifyExist = async (email, username) => {

    const userFromDb = await User.find( { $or: [ { email:  email }, { username: username } ] } )

    if(userFromDb.length > 0) {

        const error = new Error();
        error.status = 409;
        error.message = "Username or email already exist";
        throw error;
        
    }
  
    return

  }
  
module.exports = verifyExist