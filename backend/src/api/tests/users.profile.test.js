import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

vi.mock('../../models/user.model.js', () => {
  const mockUser = {
    user_id: 1,
    username: 'testuser',
    short_bio: 'Hello!',
    profile_video_path: 'uploads/mock-video.mp4',
    // kein hashed_password!
  };
  return {
    findUserById: vi.fn().mockResolvedValue(mockUser),
    updateUserVideoPath: vi.fn(),
    createUser: vi.fn(),
  };
});

describe('User Routes', () => {
  describe('GET /:userId/profile', () => {
    it('should return user profile data without password', async () => {
      const userId = 1;
      const response = await request(app)
        .get(`/api/v1/users/${userId}/profile`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        user_id: 1,
        username: 'testuser',
        short_bio: 'Hello!',
        profile_video_path: 'uploads/mock-video.mp4',
      });
      expect(response.body.hashed_password).toBeUndefined();
    });
  });
});
