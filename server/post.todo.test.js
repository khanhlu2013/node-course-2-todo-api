const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {Todo} = require('./../model/todo.js');
const {app} = require('./server.js');

describe('POST /todos',()=>{
  beforeEach(done=>{
    Todo.remove({}).then(()=>done());
  });

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
