import React from 'react';
import Sparkline from './Sparkline';
import { ChangeBadge } from './Components';

export default function KPICard({ title, value, data, color, unit, icon, previous }) {
  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: '1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      transition: 'border-color 0.2s, transform 0.2s',
      cursor: 'default',
      animation: 'fadeUp 0.4s ease both',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = color;
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = 'var(--border)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          fontSize: '0.72rem',
          color: 'var(--muted)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
        }}>
          {title}
        </div>
        <div style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: `${color}18`,
          border: `1px solid ${color}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.85rem',
        }}>
          {icon}
        </div>
      </div>

      {/* Value */}
      <div style={{
        fontFamily: 'Syne, sans-serif',
        fontSize: '1.8rem',
        fontWeight: 800,
        color,
        lineHeight: 1,
        letterSpacing: '-0.5px',
      }}>
        {value}
        {unit && (
          <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--muted)', marginLeft: '0.25rem' }}>
            {unit}
          </span>
        )}
      </div>

      {/* Change badge */}
      {previous !== undefined && (
        <ChangeBadge current={parseFloat(value)} previous={previous} />
      )}

      {/* Sparkline */}
      {data && data.length > 1 && (
        <div style={{ marginTop: '0.25rem' }}>
          <Sparkline data={data} color={color} width={140} height={32} />
        </div>
      )}
    </div>
  );
}
