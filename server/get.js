const {Todo} = require('./../model/todo.js');
const {ObjectID} = require('mongodb');

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
};

module.exports = {setGetRoute}
