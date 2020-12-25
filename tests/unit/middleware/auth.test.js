const {User} = require('../../../models/user');
const mongoose = require('mongoose');
const auth = require('../../../middleware/auth');

describe('auth middleware',()=>{
    it('sholud populate req.user with a payload of a valid jwt',()=>{
        const user = {_id: new mongoose.Types.ObjectId(),isAdmin:true}
        const token = new User(user).getAuthToken();
        const req = {
            header:jest.fn().mockReturnValue(token)
        }
        const res = {};
        const next = jest.fn();
        auth(req,res,next);
        expect(req.User).toMatchObject(User);
    })
    
})