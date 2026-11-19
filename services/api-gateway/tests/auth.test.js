const request = require('supertest');
const app = require('../src/app');

describe('authentication', () => {
  it('rejects invalid credentials', async () => {
    const response = await request(app).post('/api/auth/login')
      .send({ email: 'wrong@example.com', password: 'wrong' });
    expect(response.status).toBe(401);
  });
  it('issues a token for the configured demo account', async () => {
    const response = await request(app).post('/api/auth/login')
      .send({ email: 'admin@sentinelvault.local', password: 'ChangeMe123!' });
    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeTruthy();
  });
});
