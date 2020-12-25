let server;
const req = require('supertest');
const {Genre} = require('../../../models/genre');
const mongoose = require('mongoose');
const {User} = require('../../../models/user')
const app = require('../../../index')

describe('/api/genres',()=>{
    //beforeEach(()=>server = require('../../../index'));
    afterEach(async()=>{
        //server.close()
        await Genre.remove({})
    })
    describe('GET /',()=>{
        it('should return all genres',async()=>{
            await Genre.collection.insertMany([
                {name:'genre1'},
                {name:'genre2'}
            ]);
            const res = await req(app).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.some(g=>g.name ==='genre1')).toBeTruthy();
            expect(res.body.some(g=>g.name ==='genre2')).toBeTruthy();
        })
    })
    describe('GET /:id',()=>{
        it('should return genre with given id',async()=>{
            const genre = new Genre({name:'genre1'});
            await genre.save();
            const res = await req(app).get('/api/genres/'+genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name','genre1')
        })
        it('should return 404 if Id is not valid',async()=>{
            const res = await req(app).get('/api/genres/1');
            expect(res.status).toBe(404)
        })
        it('should return 404 if genre is not found',async()=>{
            const id = new mongoose.Types.ObjectId();
            const res = await req(app).get('/api/genres/'+id);
            expect(res.status).toBe(404)
        })
    })
    describe('POST /',()=>{
        it('should return 401 if the client is not logged in',async()=>{
            const res = await req(app)
            .post('/api/genres')
            .send({name:'genre1'});
            expect(res.status).toBe(401);
        })
        it('should return 400 if input is invalid',async()=>{
            const token = new User().getAuthToken();
            const res = await req(app)
            .post('/api/genres')
            .set('x-auth-token',token)
            .send({name:'gen'});
            expect(res.status).toBe(400);
        })
        // it('should return 400 if input is invalid',async()=>{
        //     const token = new User().getAuthToken();
        //     const res = await req(server)
        //     .post('/api/genres')
        //     .set('x-auth-token',token)
        //     .send({name:new Array(52).join('a')});
        //     expect(res.status).toBe(400);
        // })
        it('should save the genre if input is valid',async()=>{
            const token = new User().getAuthToken();
            const res = await req(app)
            .post('/api/genres')
            .set('x-auth-token',token)
            .send({name:'genre1'})
            const genre = await Genre.findOne({name:'genre1'})
            expect(genre).not.toBeNull();
        })
        it('should return the genre to the client',async()=>{
            const token = new User().getAuthToken();
            await req(app)
            .post('/api/genres')
            .set('x-auth-token',token)
            .send({name:'genre1'});
            const res = await Genre.findOne({name:'genre1'})
            expect(res).toMatchObject({name:'genre1'});
        })
    })

})

