import React from 'react';

export function Toggle({ value, onChange, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {label && (
        <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 500 }}>
          {label}
        </span>
      )}
      <div
        onClick={() => onChange(!value)}
        style={{
          width: 36,
          height: 20,
          borderRadius: 999,
          background: value ? 'var(--accent)' : 'var(--border2)',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background 0.2s',
          border: '1px solid rgba(255,255,255,0.08)',
          flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute',
          top: 2,
          left: value ? 18 : 2,
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 0.2s ease',
          boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
        }} />
      </div>
    </div>
  );
}

export function ChangeBadge({ current, previous, invertColors = false }) {
  const pct = previous ? ((current - previous) / Math.abs(previous) * 100).toFixed(1) : 0;
  const isDown = current < previous;
  const isGood = invertColors ? !isDown : isDown;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      fontSize: '0.75rem',
      fontWeight: 600,
      color: isGood ? 'var(--teal)' : 'var(--accent)',
    }}>
      <span style={{ fontSize: '0.6rem' }}>{isDown ? '▽' : '△'}</span>
      {Math.abs(pct)}% vs 2021
    </div>
  );
}

export function LiveBadge({ label }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
      padding: '0.25rem 0.7rem',
      borderRadius: 999,
      background: 'rgba(0,201,167,0.1)',
      border: '1px solid rgba(0,201,167,0.2)',
      fontSize: '0.7rem',
      fontWeight: 600,
      color: 'var(--teal)',
    }}>
      <div style={{
        width: 5,
        height: 5,
        background: 'var(--teal)',
        borderRadius: '50%',
        animation: 'blink 2s infinite',
      }} />
      {label}
    </div>
  );
}
