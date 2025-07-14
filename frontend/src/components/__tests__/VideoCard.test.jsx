import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import VideoCard from '../VideoCard';
import { vi, describe, it, expect } from 'vitest';

// Mock useMatches-Hook
vi.mock('../../hooks/useMatches', () => ({
  useMatches: () => ({
    likeVideo: vi.fn(async () => ({ isMatch: true, message: "It's a Match!" }))
  })
}));

describe('VideoCard Like-Funktion', () => {
  const video = { id: 1, video_path: 'test.mp4' };
  const videoOwner = { id: 2, username: 'TestUser' };

  it('zeigt Like-Button an und reagiert auf Klick', async () => {
    render(
      <VideoCard
        video={video}
        videoOwner={videoOwner}
        showLikeButton={true}
        onVideoLike={vi.fn()}
      />
    );
    const likeBtn = screen.getAllByTitle('Video liken und Interesse zeigen')[0];
    expect(document.body.contains(likeBtn)).toBe(true);
    fireEvent.click(likeBtn);
    await waitFor(() => {
      expect(likeBtn.classList.contains('liked')).toBe(true);
    });
  });

  it('ruft onVideoLike Callback mit Match-Response auf', async () => {
    const onVideoLike = vi.fn();
    render(
      <VideoCard
        video={video}
        videoOwner={videoOwner}
        showLikeButton={true}
        onVideoLike={onVideoLike}
      />
    );
    const likeBtn = screen.getAllByTitle('Video liken und Interesse zeigen')[0];
    fireEvent.click(likeBtn);
    await waitFor(() => {
      expect(onVideoLike).toHaveBeenCalledWith(
        expect.objectContaining({ isMatch: true })
      );
    });
  });
});
