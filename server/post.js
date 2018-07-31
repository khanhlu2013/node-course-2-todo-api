const _ = require('lodash');
const bcrypt = require('bcryptjs');

const {Todo} = require('./../model/todo.js');
const {User} = require('./../model/user.js');
const {authenticate} = require('./../middleware/authenticate.js');

setPostRoute = (app)=>{
  app.post('/todos',(req,res)=>{
    const todo = new Todo({
      text: req.body.text
    })

    todo.save().then(
      (doc)=>{res.send(doc)},
      (err)=>{res.status(400).send(err)}
    )
  });

  app.post('/users',(req,res)=>{

    const body = _.pick(req.body,['email','password'])
    if(!_.isString(body.email) || !_.isString(body.password)){
      return res.status(400);
    }

    const user = new User(body);
    user.save().then(()=>{
      return user.generateAuthToken();
    })
    .then(token =>{
      res.header('x-auth',token).send(user);
    })
    .catch(e=>{res.status(400).send(e)});
  });

  app.post('/users/login',(req,res)=>{
    const {email,password} = req.body;
    (async ()=>{
      const user = await User.findByCredential(email,password);
      if(user){
        const token = await user.generateAuthToken();
        res.header('x-auth',token).send(user);
      }else{
        res.status(401).send();
      }
    })();
  });

  // app.delete('/users/logout',authenticate,(req,res)=>{
  //   if(!req.user){
  //     res.status(400).send();
  //   }

  //   user.tokens
  // });

  app.delete('/users/me/token',authenticate,(req,res)=>{
    (async ()=>{
      try{
        await req.user.removeToken(req.token);
        res.status(200).send();
      }catch(e){
        res.status(400).send();
      }
    })();
  });
}

module.exports = {setPostRoute};
