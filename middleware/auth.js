
import jwt from 'jsonwebtoken';

export let auth = (request,response,next) => {
    try{
        const token = request.header("x-auth-token");
    jwt.verify(token,process.env.JWT_KEY);
    next();
    }
    catch(error){
        response.status(401).json({error : error.message});
    }
}