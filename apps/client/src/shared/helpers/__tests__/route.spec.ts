import { describe, expect, it } from 'vitest';

import { metresToKm, msToTime } from '../route';

describe('metresToKm', () => {
  it('Converts metres to kilometres', () => {
    expect(metresToKm(0)).toBe('0');
    expect(metresToKm(1091.19101)).toBe('1.09\u00A0km');
  });
});

describe('msToTime', () => {
  it('Converts milliseconds to seconds, minutes and hours', () => {
    expect(msToTime(0)).toBe('0');
    expect(msToTime(59100)).toBe('59\u00A0s');
    expect(msToTime(121100)).toBe('2\u00A0min');
    expect(msToTime(3600000)).toBe('1\u00A0:\u00A00\u00A0h');
    expect(msToTime(8000000)).toBe('2\u00A0:\u00A013\u00A0h');
  });
});
