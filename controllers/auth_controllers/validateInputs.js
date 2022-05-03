const validateUserInputs = (email, password, username, name) => {

    if (!username || !email || !password || !name) {
        
        const error = new Error

        error.status = 400

        error.message = "Alls fields are required"

        throw error

    }

    return
}


module.exports = validateUserInputs