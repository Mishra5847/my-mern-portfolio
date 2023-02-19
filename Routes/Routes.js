const express = require('express');
const router = express.Router();
const userModel = require('../Schema/Schema');
const bcrypt = require('bcryptjs');
const Authentication = require('../Middleware/Authentication');




//________________________________________________SIGNUP_____________________________________________________________________________________

router.post('/register', async (req, res) => {
        const {name, email, phone, work, city, password, cpassword} = req.body;
        // console.log(req.body);
       
    try {
            if(!name || !email  || !phone  || !work || !city  || !password  || !cpassword){
                return res.status(422).json({error:'All fields are required'});
            }
        
            const isUserAvailable =await userModel.findOne({email:email});
            // console.log("DB DATA", isUserAvailable)
            if(isUserAvailable){
                return res.status(400).json({error:"User already exists"});
            }
                
            if(password !== cpassword){
                return res.status(400).json({error:"Password and confirm password must be same"});
            }

            const userRegistered = new userModel({name, email, phone, work, city, password, cpassword});
                const registrationSuccess = await userRegistered.save();
                if(registrationSuccess){
                    res.status(200).json({message:"Registration completed successfully"});
                }else{
                    res.status(400).json({error:"Registration failed"})
                }
    } catch (error) {
        res.status(400).json({error:'Registration Failed'})
    }
})

//________________________________________________LOGIN_____________________________________________________________________________________

router.post('/login', async (req, res) =>{
            const {email, password} = req.body;
            // console.log(req.body);
        try {
                if(!email || !password){
                    return res.status(400).json({error:"All fields are required"});
                }

            const isUserAvailable = await userModel.findOne({email:email});
                if(!isUserAvailable){
                    return res.status(400).json({error:"User doesn't exist"})
                }

            const matchPassword = await bcrypt.compare(password, isUserAvailable.password);
                if(!matchPassword){
                        return res.status(400).json({error:'invalid email or password'});
                };
                
            const token = await isUserAvailable.generateToken();        //function generateToken() is defined in Schema file
         
                if(!token){
                        return res.status(401).json({error:"Authentication failed"})
                }else{
                    // console.log( token)
                    res.cookie('mytoken',token, {
                        expires: new Date(Date.now() + 1*60*60*1000),
                        httpOnly: true
                            })
                    res.status(200).json({message:"Login successful"});
                };
                  
        } catch (error) {
            // console.log(error)
        }
    })



//________________________________________________ABOUT_____________________________________________________________________________________
    router.get('/about', Authentication, (req, res) => {
        // res.status(200).json({message:'authentication successful'})
        res.send(req.userData)
    });


//________________________________________________Contact_____________________________________________________________________________________
    router.get('/contact', Authentication, async (req, res) =>{
        res.send(req.userData)
    })

//________________________________________________LOGOUT_____________________________________________________________________________________
    router.get('/logout', (req, res) =>{
        res.clearCookie('mytoken', {path: '/'});
        res.status(200).json({message:'Logout successful'})
    })


    //________________________________________________CONTACT MESSAGE_____________________________________________________________________________________
       router.post('/usermessage',Authentication, async(req, res) => {
        const { name, email, phone , message } = req.body;
        try {
            if(!name || !email || !phone  || !message){
                           return res.status(400).json({error:'All fields are required'})
            };

            const userData = req.userData;
            // console.log(userData.email);
            const isUserAvailable =await userModel.findOne({_id : userData._id});
                   if(!isUserAvailable){
                       return res.status(422).json({error:'something went wrong, try again !'})
                   }

                   const settingMessage = isUserAvailable.userMessageFromContact( name, email, phone, message);
                    if(!settingMessage){
                        return res.status(400).json({error:'Unfotunately, Message not sent - try again !'})
                    }else{
                                    res.status(200).json({Message:'Message sent successfully'})
                    }   
                    
                                  
        } catch (error) {
            res.status(400).json({error:'somthing went wrong, try again'});
                                    
                }
       })

module.exports = router;

