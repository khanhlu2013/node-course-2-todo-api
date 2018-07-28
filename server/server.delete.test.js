const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {Todo} = require('./../model/todo.js');
const {app} = require('./server.js');

beforeEach(done=>{
  Todo.remove({}).then(()=>done());
});

describe('DELETE /todos/:id',()=>{
    const id = new ObjectID();
    const text = 'todo to be deleted';
    beforeEach(done=>{
    new Todo({_id:id,text}).save().then(
        ()=>{done();},
        (err)=>{done(err);}
    )
    });

    it('should delete a todo',done=>{
    request(app)
    .delete(`/todos/${id.toHexString()}`)
    .expect(200)
    .expect(res=>{
        const {doc} = res.body;
        expect(doc._id).toEqual(id.toHexString());
        expect(doc.text).toEqual(text);
    })
    .end((err,res)=>{
        if(err){
            return done(err);
        }

        (async ()=>{
            try{
                const todos = await Todo.find({});
                expect(todos.length).toEqual(0);
                done();
            }catch(e){
                done(e);
            }
        })();
    })
    });

    it('should response id not valid',(done)=>{
        request(app)
        .delete(`/todos/abc`)
        .expect(404)
        .expect(res=>{
            expect(res.body.errorMessage).toEqual('id is not valid');
        })
        .end(done);
    });

    it('should response id not found',(done)=>{

        request(app)
        .delete(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .expect(res=>{
            expect(res.body.errorMessage).toEqual('id is not found');
        })
        .end(done);
    });    
});
