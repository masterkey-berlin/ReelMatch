import { describe, it, expect } from 'vitest';
import { isMatch } from '../../utils/matchLogic.js';

describe('isMatch', () => {
  it('A liked B, B liked A → Match', () => {
    const likes = [ {from: 'A', to: 'B'}, {from: 'B', to: 'A'} ];
    expect(isMatch(likes, 'A', 'B')).toBe(true);
  });

  it('A liked B, B liked nicht → Kein Match', () => {
    const likes = [ {from: 'A', to: 'B'} ];
    expect(isMatch(likes, 'A', 'B')).toBe(false);
  });

  it('A liked sich selbst → Kein Match', () => {
    const likes = [ {from: 'A', to: 'A'} ];
    expect(isMatch(likes, 'A', 'A')).toBe(false);
  });

  it('Keine Likes → Kein Match', () => {
    const likes = [];
    expect(isMatch(likes, 'A', 'B')).toBe(false);
  });
});