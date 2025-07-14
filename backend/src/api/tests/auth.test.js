import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

describe('Auth Routes', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'testuser',
        password: 'test123'
      });
    expect([200, 201, 409]).toContain(res.status);
    if (res.status !== 409) {
      expect(res.body).toHaveProperty('user_id');
      expect(res.body).toHaveProperty('username', 'testuser');
    }
  });

  it('should not login with unknown user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'unknownuser'
      });
    expect(res.status).toBe(404);
  });
});
