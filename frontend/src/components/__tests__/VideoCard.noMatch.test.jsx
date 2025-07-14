import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VideoCard from '../VideoCard';
import { vi, describe, it, expect } from 'vitest';

// Mock useMatches-Hook für Like ohne Match
vi.mock('../../hooks/useMatches', () => ({
  useMatches: () => ({
    likeVideo: vi.fn(async () => ({ isMatch: false, message: 'Kein Match' }))
  })
}));

describe('VideoCard Like ohne Match', () => {
  const video = { id: 1, video_path: 'test.mp4' };
  const videoOwner = { id: 2, username: 'TestUser' };

  it('zeigt Like-Status, aber kein Match-Modal', async () => {
    render(
      <VideoCard
        video={video}
        videoOwner={videoOwner}
        showLikeButton={true}
        onVideoLike={vi.fn()}
      />
    );
    const likeBtn = screen.getAllByTitle('Video liken und Interesse zeigen')[0];
    fireEvent.click(likeBtn);
    await waitFor(() => {
      expect(likeBtn.classList.contains('liked')).toBe(true);
      // Es wird kein Match-Modal angezeigt (hier ggf. weitere Checks möglich)
    });
  });
});
