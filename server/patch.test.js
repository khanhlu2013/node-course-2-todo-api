const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {Todo} = require('./../model/todo.js');
const {app} = require('./server.js');

beforeEach(done=>{
    Todo.find().remove().then(()=>done()).catch(e=>done(e));
})

describe('PATCH /todos/:id',()=>{

    const todos = [
        {_id:new ObjectID(),text:"x"},
        {_id:new ObjectID(),text:"y",completed:true,completedAt:123}
    ]
    beforeEach(done=>{
        Todo.insertMany(todos)
        .then(()=>done()).catch(e=>done(e));
    }) 

    it('should patch a todo',(done)=>{   
        request(app)  
        .patch(`/todos/${todos[0]._id.toHexString()}`)
        .send({text:"i am done",completed:true})
        .expect(200)
        .end((err,res)=>{
            if(err){
                return done(err);
            }

            expect(res.body.text).toEqual('i am done');
            expect(res.body.completed).toEqual(true);
            
            Todo.findById(todos[0]._id).then(doc=>{
                expect(doc.text).toEqual('i am done');
                expect(doc.completed).toEqual(true);
                done();
            }).catch(e=>done(e));
        })
    });

    it('should send 404 when id is not valid',done=>{
        request(app)
        .patch(`/todos/asdf`)
        .expect(404)
        .end(done);
    });

    it('should send 404 when id is not found',done=>{
        request(app)
        .patch(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('should clear completedAt',done=>{
        request(app)
        .patch(`/todos/${todos[1]._id.toHexString()}`)
        .send({completed:false})
        .expect(200)
        .end((err,res)=>{
            if(err){
                return done(err);
            }

            expect(res.body.completed).toEqual(false);
            expect(res.body.completedAt).toEqual(null);
            done();
        })
    })
})

