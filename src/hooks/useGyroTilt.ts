import { useEffect, useRef } from 'react';
import type { MotionValue } from 'framer-motion';

const TILT_RANGE = 0.5; // matches the -0.5..0.5 range onMouseMove writes into mx/my
const DEG_PER_RANGE = 32; // full tilt reached after 32deg away from the held-up starting angle

let iosPermissionRequested = false;

function requestIOSPermissionOnce() {
  if (iosPermissionRequested) return;
  iosPermissionRequested = true;
  if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) return;
  const doe = (window as unknown as { DeviceOrientationEvent: { requestPermission?: () => Promise<'granted' | 'denied'> } }).DeviceOrientationEvent;
  if (doe && typeof doe.requestPermission === 'function') {
    doe.requestPermission().catch(() => {});
  }
}

/** Touch-Gegenstueck zum Maus-Tilt: schreibt in dieselben mx/my
 *  Motion-Values wie `onMouseMove`, gespeist vom Gyroskop statt
 *  vom Cursor. iOS verlangt eine Nutzergeste fuer Sensor-Zugriff —
 *  der erste Touch auf der Seite reicht dafuer. Kalibriert sich auf
 *  den Winkel, in dem das Handy gerade gehalten wird (kein Sprung
 *  beim Start). */
export function useGyroTilt(mx: MotionValue<number>, my: MotionValue<number>) {
  const baseline = useRef<{ beta: number; gamma: number } | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: coarse)').matches) return;

    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      if (!baseline.current) baseline.current = { beta: e.beta, gamma: e.gamma };
      const dBeta = e.beta - baseline.current.beta;
      const dGamma = e.gamma - baseline.current.gamma;
      mx.set(Math.max(-TILT_RANGE, Math.min(TILT_RANGE, dGamma / DEG_PER_RANGE)));
      my.set(Math.max(-TILT_RANGE, Math.min(TILT_RANGE, dBeta / DEG_PER_RANGE)));
    };
    const onFirstTouch = () => {
      requestIOSPermissionOnce();
      window.removeEventListener('touchend', onFirstTouch);
    };

    window.addEventListener('deviceorientation', onOrientation);
    window.addEventListener('touchend', onFirstTouch, { once: true });
    return () => {
      window.removeEventListener('deviceorientation', onOrientation);
      window.removeEventListener('touchend', onFirstTouch);
      mx.set(0);
      my.set(0);
    };
  }, [mx, my]);
}
