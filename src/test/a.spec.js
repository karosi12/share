import expect from 'expect.js';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
before(() => {
  return mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser : true,
    useFindAndModify: false,
    useCreateIndex  : true
  });
});
describe('server is running 🚀', () => {
  it('should give the welcome address', async () => {
    try {
      const res = await request(app).get('/').expect(200);
      expect(res.status).equal(200);
      expect(res.body).have.property('message');
      expect(res.body.message).equal('server is running 🚀');
    } catch (error) {
      throw new Error(error);
    }
  });
});
