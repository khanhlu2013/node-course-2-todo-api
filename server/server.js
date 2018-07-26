const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('./mongoose.js');
const {User} = require('./../db/user.js');
const {Todo} = require('./../db/todo.js');

const app = express();

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
  const todo = new Todo({
    text: req.body.text
  })

  todo.save().then(
    (doc)=>{res.send(doc)},
    (err)=>{res.status(400).send(err)}
  )
})

app.listen(3000,()=>{
  console.log('server is listening on port 3000');
})

module.exports = {app};
