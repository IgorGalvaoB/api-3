const controlUsers = (user, friends, notFriends,skip) => {

    let users = [];

    if(user){

        users.push(user);

    }

    if(friends){

        users.push(...friends);
        
    }

    if(notFriends){

        users.push(...notFriends);

    }
    
    users = users.filter((user,index,users) =>{

        if(index===0 ){

            return user

        }

        if(index!==0 && users[index].username!==users[0].username){
            
            return user

        }
    })  

    if(users.length > 0){

        return users;

    } else { 

        const error = new Error();
        error.status = 404;
        error.message = "Users not found";
        throw error;

    }
}

module.exports = controlUsers;