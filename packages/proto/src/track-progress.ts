// packages/proto/src/track-progress.ts
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
  // 1) redirect to login if no token
  const token = localStorage.getItem('token');
  if (!token) {
    const me = window.location.pathname.split('/').pop() || '';
    return window.location.href = `login.html?redirect=${me}`;
  }

  // 2) fetch your /api/auth/me endpoint
  const res = await fetch('/api/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) {
    console.error('❌ Failed to fetch /api/auth/me', res.status);
    // token might be invalid—send back to login
    return window.location.href = 'login.html?redirect=track_progress.html';
  }
  const user: User = await res.json();

  // 3) slice usage[] and feed each bar-chart
  let offset = 0;
  for (let i = 0; i < SIZES.length; i++) {
    const count = SIZES[i];
    const slice = user.usage.slice(offset, offset + count);
    offset += count;

    const el = document.getElementById(IDS[i]) as any;
    if (el) {
      el.data    = slice;
      el.variant = VARIANTS[i];
      el.unit    = 'uses';
    }
  }
}

document.addEventListener('DOMContentLoaded', boot);
