const validateUserInputs = (email, password, username) => {

    if (!username || !email || !password) {
        
        const error = new Error

        error.status = 400

        error.message = "Alls fields are required"

        throw error

    }

    return
}


module.exports = validateUserInputs