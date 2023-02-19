const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// ___________________________________________UserSchema_______________________________________________________________________
const userSchema = new mongoose.Schema({
                                        date: { type: Date,
                                                default: Date.now() },

                                        name: {type: String,
                                              required: true},

                                        email: {type: String,
                                               required: true},

                                        phone:  {type: Number,
                                               required: true},

                                        city: {type: String,
                                               required: true},

                                        work: {type: String,
                                               required: true},

                                        password: {type: String,
                                               required: true},

                                        cpassword: {type: String,
                                               required: true},

                                        tokens: [
                                                 {
                                                 token: { type: String,
                                                        required: true } 
                                                 }
                                                 ],

                                   messages: [
                                              {      
                                                 name: {type: String,
                                                        required: true},
          
                                                  email: {type: String,
                                                         required: true},
          
                                                  phone:  {type: Number,
                                                           required: true},
          
                                                  message: { type: String,
                                                             required: true },

                                                  date: {type: Date,
                                                         default: Date.now()},
                                              }
                                            ]
});

userSchema.pre('save', async function(next){
              if(this.isModified('password')){
                     this.password = await  bcrypt.hash(this.password, 12);
                     this.cpassword= await bcrypt.hash(this.cpassword, 12);
              }
              next()
});

userSchema.methods.generateToken = async function(){
       const token =  jwt.sign({email:this.email}, process.env.SECRET_KEY);
       this.tokens = this.tokens.concat({token:token});
       await this.save();
       return token;
};

userSchema.methods.userMessageFromContact = async function(name, email, phone, message){
       this.messages = this.messages.concat({name, email, phone, message})
       await this.save();
}


const userModel = mongoose.model('user', userSchema);




// ___________________________________________Exports_______________________________________________________________________

module.exports = userModel;