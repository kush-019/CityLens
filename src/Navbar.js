import React, { useState, useEffect } from 'react';
import { LiveBadge } from './Components';

const NAV_LINKS = [
  { label: 'Overview',  id: 'overview' },
  { label: 'Dashboard', id: 'dashboard' },
  { label: 'Deep Dive', id: 'deepdive' },
  { label: 'About',     id: 'about' },
];

export default function Navbar() {
  const [active, setActive] = useState('overview');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const ids = NAV_LINKS.map(l => l.id);
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && window.scrollY >= el.offsetTop - 80) {
          setActive(ids[i]);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop - 64, behavior: 'smooth' });
      setActive(id);
    }
  };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
      height: 56, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 1.5rem',
      background: scrolled ? 'rgba(9,9,15,0.97)' : 'rgba(9,9,15,0.8)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
      transition: 'all 0.3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.8rem', color: '#fff',
        }}>CL</div>
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
            City<span style={{ color: 'var(--accent)' }}>Lens</span>
          </div>
          <div style={{ fontSize: '0.62rem', color: 'var(--muted)', lineHeight: 1 }}>India Safety & Social Explorer</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {NAV_LINKS.map(link => {
          const isActive = active === link.id;
          return (
            <a key={link.id} href={`#${link.id}`}
              onClick={e => handleClick(e, link.id)}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: 8,
                fontSize: '0.82rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--text)' : 'var(--muted)',
                textDecoration: 'none',
                background: isActive ? 'rgba(255,255,255,0.07)' : 'transparent',
                borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'all 0.15s',
                display: 'inline-block',
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.background = 'transparent'; }}}
            >{link.label}</a>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <LiveBadge label="36 States · 292 Cities" />
        <div style={{ padding: '0.3rem 0.75rem', borderRadius: 8, background: 'var(--card)', border: '1px solid var(--border)', fontSize: '0.72rem', color: 'var(--muted)' }}>
          Data: 2021–2023
        </div>
      </div>
    </nav>
  );
}
