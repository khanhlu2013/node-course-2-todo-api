const request = require('supertest');
const expect = require('expect');
const jwt = require('jsonwebtoken');

const {app} = require('./server.js');
const {User} = require('./../model/user.js');

describe('POST /users',()=>{

  beforeEach(done=>{
    User.remove().then(()=>done())
  })

  it('should sign up user',done=>{
    const email = 'khanh@lu.com';
    const password = '123456';

    request(app)
    .post('/users')
    .send({email,password})
    .expect(200)
    .expect(res=>{
      expect(res.body._id).not.toBeFalsy();
      expect(res.body.email).toEqual(email);
      const decode = jwt.verify(res.header['x-auth'],'my secrete')
      expect(decode._id).toBe(res.body._id)      
    })
    .end((err)=>{
      if(err){
        return done(err);
      }

      User.findOne({email}).then(user=>{
        expect(user).toBeTruthy();
        expect(user.password).not.toBe(password);
        done();
      })
    });
  });
  
  it('should return 400 if user have invalid email',done=>{
    const email = 'abc';
    const password = '123456';

    request(app)
    .post('/users')
    .send({email,password})
    .expect(400)
    .end(done);
  });

  it('should return 400 if user have invalid password',done=>{
    const email = 'abc@efg.com';
    const password = '12345';

    request(app)
    .post('/users')
    .send({email,password})
    .expect(400)
    .end(done);
  });

  it('should return 404 if email is duplicated',done=>{
    const email = 'khanh@lu.com';
    const password = '123456';
    (async ()=>{
      await new User({email,password}).save();
      request(app)
      .post('/users')
      .send({email,password})
      .expect(400)
      .end(done);
    })();
  })
})