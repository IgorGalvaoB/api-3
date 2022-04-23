const verifyCredentials = (id,userId) => {

    if (id!==userId) {
        
        const error = new Error
        error.status = 401
        error.message = "Invalid credentials"
        throw error

    } 

    return
}

module.exports = verifyCredentials;