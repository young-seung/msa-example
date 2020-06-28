import request from 'supertest';
import App from './main';

describe('Auth App', () => {
  const req = request(App);

  it('GET /', async () => {
    const res = await req.get('/').expect(200);
    expect(res.text).toBe('Hello World!');
  });

  it('GET /not_found', async () => {
    const res = await req.get('/not_found').expect(404);
    expect(res.body.message).toBe('Not Found');
  });
});
