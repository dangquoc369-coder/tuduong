/**
 * Screen Wake Lock API helper to keep the mobile device screen active during chanting sessions
 */

class WakeLockManager {
  private sentinel: any = null;
  private isRequested = false;

  public async acquire(): Promise<boolean> {
    this.isRequested = true;
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) {
      return false;
    }

    try {
      if (!this.sentinel) {
        this.sentinel = await (navigator as any).wakeLock.request('screen');
        this.sentinel.addEventListener('release', () => {
          this.sentinel = null;
          // Re-acquire if visibility changes back to visible
          if (this.isRequested && document.visibilityState === 'visible') {
            this.acquire().catch(() => {});
          }
        });
      }
      return true;
    } catch (err) {
      console.warn('Wake Lock request error:', err);
      return false;
    }
  }

  public async release(): Promise<void> {
    this.isRequested = false;
    if (this.sentinel) {
      try {
        await this.sentinel.release();
      } catch {}
      this.sentinel = null;
    }
  }
}

export const wakeLock = new WakeLockManager();
