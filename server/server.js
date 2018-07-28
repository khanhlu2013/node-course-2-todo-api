const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('./../db/mongoose.js');
const {User} = require('./../model/user.js');
const {Todo} = require('./../model/todo.js');
const {setPostRoute} = require('./post.js');
const {setGetRoute} = require('./get.js');
const {setDeleteRoute} = require('./delete.js');

const app = express();

app.use(((req,res,next)=>{
  //console.log("URL: ",req.originalUrl);
  next();
}));
app.use(bodyParser.json());
setGetRoute(app);
setPostRoute(app);
setDeleteRoute(app);

const {PORT=3000} = process.env;
app.listen(PORT,()=>{
  console.log(`server is listening on port ${PORT}`);
})

module.exports = {app};
