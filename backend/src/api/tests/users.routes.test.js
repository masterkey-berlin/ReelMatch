import { describe, it, expect, vi, beforeEach } from 'vitest';
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
      req.file = {
        path: 'uploads/mock-video.mp4',
        originalname: 'mock-video.mp4',
        mimetype: 'video/mp4',
        size: 12345
      };
      next();
    },
  },
}));

const { updateUserVideoPath } = await import('../../models/user.model.js');

describe('User Routes', () => {
  describe('POST /:userId/intro-video', () => {
    beforeEach(() => {
      updateUserVideoPath.mockClear();
    });

    it('should upload a video and return 200 on success', async () => {
      const userId = 1;
      const mockUpdatedUser = { user_id: 1, profile_video_path: 'uploads/mock-video.mp4' };

      updateUserVideoPath.mockResolvedValue(mockUpdatedUser);

      const response = await request(app)
        .post(`/api/v1/users/${userId}/intro-video`)
        .attach('introVideo', Buffer.from('fake video data'), 'test-video.mp4');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Video uploaded successfully.');
      expect(response.body.user).toEqual(mockUpdatedUser);
      expect(updateUserVideoPath).toHaveBeenCalledWith(
        userId.toString(),
        'uploads/mock-video.mp4'
      );
    });
  });
});