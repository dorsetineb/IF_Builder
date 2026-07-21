import { describe, it, expect } from 'vitest';
import { isNewerVersion } from '../services/autoUpdater';

describe('autoUpdater - isNewerVersion', () => {
  it('should return true when remote version is higher patch', () => {
    expect(isNewerVersion('0.3.0', '0.3.1')).toBe(true);
    expect(isNewerVersion('v0.3.0', 'v0.3.1')).toBe(true);
  });

  it('should return true when remote version is higher minor', () => {
    expect(isNewerVersion('0.3.0', '0.4.0')).toBe(true);
    expect(isNewerVersion('v0.3.0', 'v0.4.0')).toBe(true);
  });

  it('should return true when remote version is higher major', () => {
    expect(isNewerVersion('0.3.0', '1.0.0')).toBe(true);
  });

  it('should return false when versions are equal', () => {
    expect(isNewerVersion('0.3.0', '0.3.0')).toBe(false);
    expect(isNewerVersion('v0.3.0', 'v0.3.0')).toBe(false);
  });

  it('should return false when local version is newer than remote', () => {
    expect(isNewerVersion('0.4.0', '0.3.9')).toBe(false);
    expect(isNewerVersion('1.0.0', '0.9.9')).toBe(false);
  });
});
