const jwt = require('jsonwebtoken');

const authorization = (req,res,next)=>{

    const token = req.headers.authorization;

    if(!token){

        return res.status(401).json({error:"No token provided"})

    }

    const tokenWhitoutBearer = token.split(' ')[1];

    try {

        const decodedToken = jwt.verify(tokenWhitoutBearer,process.env.SECRET)
        req.username = decodedToken.username;
        req.id = decodedToken.id;
        next()

    } catch (error) {

        error.message = "Invalid token"
        res.status(401).json(error)   
        
    }
}
module.exports = authorization;