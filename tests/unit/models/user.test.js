const {User} = require('../../../models/user');
const mongoose  = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');


describe('user.getAuthToken',()=>{
    it('should return token for given id',()=>{
        const payload = {_id:new mongoose.Types.ObjectId().toHexString(),isAdmin:true}
        const user = new User(payload);
        const token = user.getAuthToken();
        const decoded = jwt.verify(token,config.get('jwtPrivateKey'));
        expect(decoded).toMatchObject(payload);
    })
})



