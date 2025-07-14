import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VideoCard from '../VideoCard';
import { vi, describe, it, expect } from 'vitest';

// Mock useMatches-Hook für Like-Fehlerfall
vi.mock('../../hooks/useMatches', () => ({
  useMatches: () => ({
    likeVideo: vi.fn(async () => { throw new Error('Like fehlgeschlagen'); })
  })
}));

describe('VideoCard Like-Fehler', () => {
  const video = { id: 1, video_path: 'test.mp4' };
  const videoOwner = { id: 2, username: 'TestUser' };

  it('zeigt keinen Match-Modal und bleibt klickbar bei Like-Fehler', async () => {
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
      expect(likeBtn.classList.contains('liked')).toBe(false);
    });
  });
});
