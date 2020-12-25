const { Genre } = require('../../../models/genre');
let server;
const req = require('supertest');
const { User } = require('../../../models/user');
let app = require('../../../index')

describe('auth middleware',()=>{
    //beforEach(()=>server = require('../../../index'));
    afterEach(async()=>
    {
    //server.close()
    await Genre.remove({})
    });
    it('should return 401 if no token is provided',async()=>{   
        const res = await req(app)
            .post('/api/genres')
            .send({name:'genre1'});
            expect(res.status).toBe(401);
    })
    it('should return 400 if invalid token is provided',async()=>{
        const res = await req(app)
        .post('/api/genres')
        .send('a-auth-token','1234')
        .send({name:'genre1'});
        expect(res.status).toBe(401);
    })
    it('should return 200 if valid token is provided',async()=>{
        const token = new User().getAuthToken();
        const res = await req(app)
        .post('/api/genres')
        .set('a-auth-token',token)
        .send({name:'genre1'});
        expect(res.status).toBe(401);
    })
})

