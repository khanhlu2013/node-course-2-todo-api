var env = process.env.NODE_ENV || 'development';

if(env === 'production'){
  //do nothing
}else if(env === 'test'){
  process.env.PORT = 4000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}else if(env === 'development'){
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
}else{
  throw Error('Unexpected process.env value of: ', env);
}