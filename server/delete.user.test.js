const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {app} = require('./server.js');
const {User} = require('./../model/user.js');

describe('DELETE /users/me/token: logout user',()=>{

  const email = 'khanh@lu.com';
  const password = '123456';

  beforeEach(done=>{
    (async ()=>{
      try{
        await User.remove();
        const user = await new User({email,password}).save();

        done();
      }catch(e){
        done(e);
      }
    })();
  });

  it('should remove token when user logout',done=>{
    (async()=>{
      const user = await User.findByCredential(email,password);
      await user.generateAuthToken();      
      request(app)
      .delete('/users/me/token')
      .set('x-auth',user.tokens[0].token)
      .expect(200)
      .end((err,res)=>{
        if(err){
          return done(err);
        }

        (async ()=>{
          try{
            const toBeVerifiedUser = await User.findById(user._id);
            expect(toBeVerifiedUser.tokens.length).toBe(0);
            done();
          }catch(e){
            done(e);
          }
        })();
      });
    })();
  });
})