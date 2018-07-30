const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email : {
    type : String,
    require : true,
    minlength : 1,
    trim : true,
    unique : true,
    validate :{
      validator: validator.isEmail,
      message : '{VALUE} is not a valid email'
    }
  },
  password : {
    type : String,
    require : true,
    minlength : 6
  },
  tokens:[{
    access : {
      type : String,
      require : true
    },
    token:{
      type:String,
      require:true
    }
  }]
});
UserSchema.methods.attachAuthToken = function(){
  const user = this;
  const access = "auth";
  const token = jwt.sign({
    _id:user._id.toHexString(),
    access
  },'my secrete');
  user.tokens = user.tokens.concat({access,token});
  return user.save().then(()=>token);
}
UserSchema.methods.toJSON = function(){
  const user = this;
  const userObject = user.toObject();
  return _.pick(userObject,["_id", "email"]);
}
UserSchema.statics.findByToken = function(token){
  const User = this;

  try{
    const decoded = jwt.verify(token,'my secrete');
    return User.findOne({
      _id : decoded._id,
      "tokens.token" : token,
      "tokens.access" : "auth"
    });
  }catch(err){
    return Promise.reject();
  }
}
UserSchema.pre('save',function(next){
  (async ()=>{
    const user = this;
    if(user.isModified('password')){
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(user.password,salt);
      user.password = hash;
      next();
    }else{
      next();
    }
  })().catch(e=>{throw e});
})
const User = mongoose.model('User',UserSchema);

module.exports = {User};
