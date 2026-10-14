'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function generateRandomId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'v-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now().toString(36);
}

function getOrSetVisitorId(): string {
  if (typeof window === 'undefined') return '';
  const STORAGE_KEY = '_mbg_vid';
  try {
    let vid = localStorage.getItem(STORAGE_KEY);
    if (!vid) {
      vid = generateRandomId();
      localStorage.setItem(STORAGE_KEY, vid);
    }
    return vid;
  } catch {
    return 'anon-' + Math.random().toString(36).substring(2, 10);
  }
}

function getOrSetSessionId(): string {
  if (typeof window === 'undefined') return '';
  const SESSION_KEY = '_mbg_sid';
  const EXPIRY_KEY = '_mbg_sid_exp';
  const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes session timeout

  try {
    const now = Date.now();
    const expStr = sessionStorage.getItem(EXPIRY_KEY);
    let sid = sessionStorage.getItem(SESSION_KEY);

    if (!sid || !expStr || now > parseInt(expStr, 10)) {
      sid = 's-' + generateRandomId();
      sessionStorage.setItem(SESSION_KEY, sid);
    }

    // Refresh expiry
    sessionStorage.setItem(EXPIRY_KEY, (now + TIMEOUT_MS).toString());
    return sid;
  } catch {
    return 'sess-' + Math.random().toString(36).substring(2, 10);
  }
}

export default function VisitorTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTracked = useRef<string>('');

  useEffect(() => {
    if (!pathname) return;

    // Do not track admin routes or API routes
    if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
      return;
    }

    const fullPath = searchParams && searchParams.toString() 
      ? `${pathname}?${searchParams.toString()}` 
      : pathname;

    // Prevent immediate duplicate firing for the exact same URL
    if (lastTracked.current === fullPath) {
      return;
    }
    lastTracked.current = fullPath;

    // Delay slightly to let document.title update
    const timer = setTimeout(() => {
      try {
        const visitorId = getOrSetVisitorId();
        const sessionId = getOrSetSessionId();
        const screenResolution = typeof window !== 'undefined' 
          ? `${window.screen.width}x${window.screen.height}` 
          : '';

        const payload = JSON.stringify({
          visitorId,
          sessionId,
          path: pathname,
          title: document.title || 'Sistem MBG Lebak',
          referrer: document.referrer || '',
          screenResolution,
        });

        if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
          const blob = new Blob([payload], { type: 'application/json' });
          navigator.sendBeacon('/api/analytics/track', blob);
        } else {
          fetch('/api/analytics/track', {
            method: 'POST',
            body: payload,
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,
          }).catch(() => {});
        }
      } catch (err) {
        // Silently catch tracking errors so public UI is never impacted
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null;
}
