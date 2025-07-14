import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

describe('Rooms API', () => {
  it('should return all rooms', async () => {
    const res = await request(app).get('/api/v1/rooms');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a new room', async () => {
    const res = await request(app)
      .post('/api/v1/rooms')
      .send({ name: 'Test Room', description: 'Test Beschreibung' });
    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty('name', 'Test Room');
  });
});
