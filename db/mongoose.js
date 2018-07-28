const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp'
mongoose.connect(url,{useNewUrlParser: true });

module.export = {mongoose};
