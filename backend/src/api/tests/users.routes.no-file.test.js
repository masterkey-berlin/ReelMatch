import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

vi.mock('../../models/user.model.js', () => ({
  updateUserVideoPath: vi.fn(),
  findUserById: vi.fn(),
  createUser: vi.fn(),
}));

vi.mock('../../middleware/upload.middleware.js', () => ({
  default: {
    single: () => (req, res, next) => {
      req.file = null;
      next();
    },
  },
}));

describe('User Routes', () => {
  describe('POST /:userId/intro-video', () => {
    it('should return 400 if no file is provided', async () => {
      const userId = 1;
      const response = await request(app)
        .post(`/api/v1/users/${userId}/intro-video`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('No video file uploaded.');
    });
  });
});
