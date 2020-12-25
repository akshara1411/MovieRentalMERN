const { JsonWebTokenError } = require("jsonwebtoken");

const jwt = require('jsonwebtoken');
const config = require('config');
function auth(req,res,next){
    const token = req.header('x-auth-token');
    console.log(token)
    if(!token) return res.status(401).send("Acces denied, No token");
    
    try{
        const decoded = jwt.verify(token,config.get('jwtPrivateKey'));
        req.user = decoded;
        console.log(decoded);
        next();
    }
    catch(ex){
        return res.status(400).send('Invalid token');
        
    }

}

module.exports = auth;