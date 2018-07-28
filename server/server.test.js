const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {Todo} = require('./../model/todo.js');
const {app} = require('./server.js');

beforeEach(done=>{
  Todo.remove({}).then(()=>done());
});

describe('GET /todos',()=>{
  const todos = ['todo 1','todo 2'];
  beforeEach(done=>{
    Todo.insertMany(todos.map(text=>({text}))).then(
      ()=>{done();},
      (err)=>{done(err);}
    )
  });

  it('should get all todos',done=>{
    request(app)
    .get('/todos')
    .expect(200)
    .expect(res=>{
      const {todos} = res.body;
      expect(todos.length).toEqual(2);
      expect(todos[0].text).toEqual('todo 1');
      expect(todos[1].text).toEqual('todo 2');
    })
    .end(done)
  });
});

describe('GET /todos/:id',()=>{
  
  const id = new ObjectID();
  const notFoundId = new ObjectID();

  beforeEach(done=>{
    new Todo({
      _id: id,
      text : "something todo"      
    }).save().then(
      ()=>{done();},
      (e)=>{done(e)}
    )
  });

  it('should get todo by id',(done)=>{
    request(app)
    .get(`/todos/${id.toHexString()}`)
    .expect(200)
    .end(done);
  });
  it('should response id not found on a non-exist valid id',(done)=>{
    request(app)
    .get(`/todos/${notFoundId.toHexString()}`)
    .expect(404)
    .expect(res=>{
      console.log(JSON.stringify(res,undefined,2));
      console.log(JSON.stringify(res.text,undefined,2));
      expect(res.body.errorText).toEqual('Id not found');
    })
    .end(done)
  }); 
  it('should response invalid id on invalid id',(done)=>{
    request(app)
    .get(`/todos/${notFoundId.toHexString()}`)
    .expect(404)
    .end(done)
  });   
})

describe('POST /todos',()=>{
  it('should save todo',(done)=>{
    const text = 'Test todo text';
    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res)=>{
      expect(res.body.text).toEqual(text);
    })
    .end((err,res)=>{
      if(err){
        return done(err);
      }

      Todo.find().then(todos=>{
        expect(todos.length).toEqual(1);
        expect(todos[0].text).toEqual(text);
        done();
      }).catch(err=>{
        done(err);
      })
    })
  });

  it('should not create todo with invalid data',(done)=>{
    request(app)
      .post('/todos')
      .send({text:''})
      .expect(400)
      .end((err,res)=>{
        if(err){
          return done(err);
        }

        Todo.find().then(todos=>{
          expect(todos.length).toBe(0);
          done();
        }).catch(err=>{
          done(err);
        })
      });
  });
});
