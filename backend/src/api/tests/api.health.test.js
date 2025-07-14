import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

describe('API Health', () => {
  it('should return API health status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status');
  });
});
