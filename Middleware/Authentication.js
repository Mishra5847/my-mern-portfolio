const jwt = require('jsonwebtoken');
const userModel = require('../Schema/Schema');


const Authentication = async(req, res, next) =>{
    try {
        const token =  req.cookies.mytoken;
        // console.log(token)
        const verifyingToken = jwt.verify(token, process.env.SECRET_KEY);
                // console.log(verifyingToken)
                const userData = await userModel.findOne({email:verifyingToken.email});
                
            if(!userData){
               return res.status(422).json({error:'authentication failed'})
            }

            // console.log(userData)
        
            req.token = token;
            req.userData = userData;
            next()

    } catch (error) {
        res.status(401).send('unauthorized: no token provided')
    //   console.log(error);
    }
                
                
}

module.exports = Authentication;