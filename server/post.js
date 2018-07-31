const _ = require('lodash');

const {Todo} = require('./../model/todo.js');
const {User} = require('./../model/user.js');

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
      return user.attachAuthToken();
    })
    .then(token =>{
      res.header('x-auth',token).send(user);
    })
    .catch(e=>{res.status(400).send(e)});
  });
}

module.exports = {setPostRoute};
