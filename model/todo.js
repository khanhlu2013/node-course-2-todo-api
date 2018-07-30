const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const jwt = require('jsonwebtoken');

const todoSchema = new Schema({
  text : {
    type : String,
    require : true,
    minlength : 1,
    trim : true
  },
  completed : {
    type : Boolean,
    default : false
  },
  completedAt : {
    type : Number,
    default : null
  }
});

const Todo = mongoose.model('Todo',todoSchema);

module.exports = {Todo};
