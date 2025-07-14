import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

describe('Posts API', () => {
  it('should return all posts', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should create a new post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({ user_id: 1, room_id: 1, video_path: 'uploads/test.mp4', description: 'Test Post' });
    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty('description', 'Test Post');
  });
});
