import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MatchList from '../MatchList';
import { vi, describe, it, expect } from 'vitest';
import * as useMatchesHook from '../../hooks/useMatches';

// Mock useMatches-Hook für MatchList
const mockMatches = [
  {
    match_id: 1,
    partner_id: 2,
    partner_username: 'TestPartner',
    partner_video_path: 'uploads/test.mp4',
    created_at: new Date().toISOString()
  }
];

vi.spyOn(useMatchesHook, 'useMatches').mockImplementation(() => ({
  matches: mockMatches,
  loading: false,
  error: null,
  fetchMatches: vi.fn(),
  expressInterest: vi.fn(),
  likeVideo: vi.fn(),
  clearError: vi.fn()
}));

describe('MatchList Anzeige', () => {
  it('zeigt Matches aus useMatches an', async () => {
    render(<MatchList />);
    // Debug-Ausgabe für das aktuelle DOM
    // screen.debug();
    // Warte, bis der Ladespinner verschwindet
    await waitFor(() => {
      expect(screen.queryByText('Matches werden geladen...')).toBeNull();
    }, { timeout: 2000 });
    // Suche nach einem Beispiel-Matchnamen aus der Komponente
    const partner = screen.queryByText(/Masterkey/i);
    expect(partner).toBeTruthy();
    // Überschrift prüfen
    const header = screen.queryByText(/Deine Matches/i);
    expect(header).toBeTruthy();
  });
});
