const {Todo} = require('./../model/todo.js');
const {User} = require('./../model/user.js');
const {ObjectID} = require('mongodb');
const {authenticate} = require('./../middleware/authenticate.js');

setGetRoute = (app)=>{
  app.get('/todos',(req,res)=>{
    Todo.find().then(
      todos=>{res.send({todos})},
      error=>{res.status(400).send(error)}
    )
  });

  app.get('/todos/:id',(req,res)=>{
    (async ()=>{
      const id = req.params.id;
  
      if(!ObjectID.isValid(id)){
        return res.status(404).send({errorText:'Id is invalid'});
      }
  
      try{
        const todo = await Todo.findById(id);
        if(!todo){
          return res.status(404).send({errorText:'Id not found'});
        }
        return res.send({todo});        
      }catch(e){
        return res.status(400).send('Some error occur');
      }
    })();
  });

  app.get('/users',(req,res)=>{
    User.find().then(users=>res.send({users}))
    .catch(e=>res.status(400));
  });

  app.get('/users/me',authenticate,(req,res)=>{
    res.send(req.user);
  })
};

module.exports = {setGetRoute}
