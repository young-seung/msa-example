import Express from 'express';
import Request from 'supertest';
import bcrypt from 'bcryptjs';

const app = Express();

describe('Get /user', () => {
  test('create user', async () => {
    const response = await Request(app)
      .post('/user')
      .send({
        name: 'test',
        email: 'test@test.com',
        password: bcrypt.hashSync('1', 8),
        createdAt: new Date()
    })
    // expect(response.status).toEqual(200)
  });
});