// packages/app/src/track-progress.ts
import './bar-chart.js';

interface User {
  usage: number[];
}

const SIZES    = [24,24,7,7,31,31,12,12];
const VARIANTS = ['day','day','week','week','month','month','year','year'] as const;
const IDS      = [
  'daily-left','daily-right',
  'weekly-left','weekly-right',
  'monthly-left','monthly-right',
  'yearly-left','yearly-right'
] as const;

async function boot() {
  const token = localStorage.getItem('token');

  if (!token) {
    // We are not redirecting to login here—just bail out silently.
    console.log('No token; skipping fetch.');
    return;
  }

  // If token exists, attempt to fetch /api/auth/me
  const res = await fetch('/api/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) {
    console.warn('Failed to fetch /api/auth/me');
    // Instead of redirecting, maybe clear token or bail out:
    // localStorage.removeItem('token');
    return;
  }

  const user: User = await res.json();

  // Now populate the bar-chart Web Components
  let offset = 0;
  for (let i = 0; i < SIZES.length; i++) {
    const count = SIZES[i];
    const slice = user.usage.slice(offset, offset + count);
    offset += count;

    const el = document.getElementById(IDS[i]) as any;
    if (el) {
      el.data    = slice;
      el.variant = VARIANTS[i];
      el.unit    = 'lbs';
    }
  }
}

document.addEventListener('DOMContentLoaded', boot);
