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
UserSchema.methods.generateAuthToken = function(){
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
UserSchema.methods.removeToken = function(token){
  return (async()=>{
    const user = this;
    const result = await user.update({
      $pull:{
        tokens : {token}
      }
    });
  })();
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
UserSchema.statics.findByCredential = function(email,password){
  const User = this;
  return (async ()=>{
    const user = await User.findOne({email});
    const result = await bcrypt.compare(password,user.password);

    if(result){
      return user;
    }else{
      return null;
    }
  })();
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
