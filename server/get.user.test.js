const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const expect = require('expect');

const {app} = require('./server.js');
const {User} = require('./../model/user.js');

const userID1 = new ObjectID();
const userID2 = new ObjectID();

const users = [
    {
        _id : userID1,
        email : 'khanh@lu.com',
        password : 'userPassword1',
        tokens : [
            {
                access : 'auth',
                token : jwt.sign({
                    _id : userID1,
                    access : 'auth'
                },'my secrete').toString()
            }
        ]
    },
    {
        _id : userID2,
        email : 'tu@nguyen.com',
        password : "userPassword2"
    }
]

const createUsers = ()=>{
    return (async ()=>{
        await User.remove({});

        const user1 = new User(users[0]).save();
        const user2 = new User(users[1]).save();
        return await Promise.all([user1,user2]);
    })();
}



describe('GET /users/me',()=>{
    beforeEach(done=>{
        createUsers().then(()=>{
            done();
        })
    })

    it('should return a user if authenticate',(done)=>{
        request(app)
        .get('/users/me')
        .set('x-auth',users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body.email).toEqual(users[0].email);
            expect(res.body._id).toEqual(users[0]._id.toHexString());
        })
        .end(done);
    })

    it('should return a 401 if user not authenticated',(done)=>{
        request(app)
        .get('/users/me')
        .expect(401)
        .end(done);
    })
});


