const {Todo} = require('./../model/todo.js');

setPostRoute = (app)=>{
  app.post('/todos',(req,res)=>{
    const todo = new Todo({
      text: req.body.text
    })

    todo.save().then(
      (doc)=>{res.send(doc)},
      (err)=>{res.status(400).send(err)}
    )
  })
}

module.exports = {setPostRoute};
