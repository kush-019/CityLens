import React, { useState } from 'react';
import Navbar from './Navbar';
import KPICard from './KPICard';
import TableauEmbed from './TableauEmbed';
import { Toggle, ChangeBadge } from './Components';
import { STATE_DATA, CITY_AQI, INDICATORS } from './data';
import { fmt, getAQIColor, getAQILabel, getStateCities, getStateAvgAQI } from './helpers';

const sectionStyle = {
  maxWidth: 1400,
  margin: '0 auto',
  padding: '3rem 2rem',
};

const sectionHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  marginBottom: '1.5rem',
};

function SectionHeader({ title }) {
  return (
    <div style={sectionHeaderStyle}>
      <h2 style={{
        fontFamily: 'Syne, sans-serif',
        fontSize: '1.2rem',
        fontWeight: 700,
        letterSpacing: '-0.3px',
        whiteSpace: 'nowrap',
      }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  );
}

export default function App() {
  const [selectedState, setSelectedState] = useState('');
  const [showPctDiff, setShowPctDiff] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Compute stats
  const filtered = selectedState
    ? STATE_DATA.filter(s => s.state === selectedState)
    : STATE_DATA;

  const sd = filtered[0];
  const avgCrime = (filtered.reduce((a, s) => a + s.rates[2], 0) / filtered.length).toFixed(2);
  const avgCrime21 = (filtered.reduce((a, s) => a + s.rates[0], 0) / filtered.length).toFixed(2);
  const avgLiteracy = (filtered.reduce((a, s) => a + s.literacy, 0) / filtered.length).toFixed(1);
  const totalPop = filtered.reduce((a, s) => a + s.pop, 0);
  const avgAQI = selectedState
    ? getStateAvgAQI(selectedState, CITY_AQI)
    : (CITY_AQI.reduce((a, c) => a + c.aqi, 0) / CITY_AQI.length).toFixed(1);

  const crimeRates = sd ? sd.rates : STATE_DATA.map(s => s.rates[2]);
  const cities = selectedState ? getStateCities(selectedState, CITY_AQI) : [];

  // Top 5 states by crime
  const topCrimeStates = [...STATE_DATA]
    .filter(s => s.rates[2] < 200) // exclude Manipur outlier for scale
    .sort((a, b) => b.rates[2] - a.rates[2])
    .slice(0, 8);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />

      {/* HERO */}
      <section id="overview" style={{
        paddingTop: 96,
        paddingBottom: '2rem',
        ...sectionStyle,
        padding: '96px 2rem 2rem',
      }}>
        {/* Eyebrow */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.3rem 0.8rem',
          borderRadius: 999,
          background: 'rgba(0,201,167,0.1)',
          border: '1px solid rgba(0,201,167,0.2)',
          fontSize: '0.7rem',
          fontWeight: 600,
          color: 'var(--teal)',
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
          marginBottom: '1.25rem',
          animation: 'fadeUp 0.5s ease both',
        }}>
          <div style={{ width: 5, height: 5, background: 'var(--teal)', borderRadius: '50%', animation: 'blink 2s infinite' }} />
          India Public Safety Analytics
        </div>

        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-1.5px',
          marginBottom: '1rem',
          animation: 'fadeUp 0.5s 0.1s ease both',
        }}>
          Explore India's{' '}
          <span style={{
            background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Safety & Social Data
          </span>
        </h1>

        <p style={{
          fontSize: '1rem',
          color: 'var(--muted2)',
          lineHeight: 1.75,
          maxWidth: 560,
          marginBottom: '2rem',
          animation: 'fadeUp 0.5s 0.2s ease both',
        }}>
          Crime rates, air quality, literacy and population data across all 36 Indian states
          and union territories — 2021 to 2023.
        </p>

        {/* Stat pills */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.6rem',
          marginBottom: '2.5rem',
          animation: 'fadeUp 0.5s 0.3s ease both',
        }}>
          {[
            { val: '36', label: 'States & UTs', color: 'var(--accent)' },
            { val: '292', label: 'Cities Monitored', color: 'var(--accent2)' },
            { val: '1.38B', label: 'Population Covered', color: 'var(--teal)' },
            { val: '3 Years', label: 'Crime Data', color: 'var(--blue)' },
            { val: '4', label: 'Social Indicators', color: '#a78bfa' },
          ].map(p => (
            <div key={p.label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.9rem',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              fontSize: '0.8rem',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
              <strong style={{ color: p.color }}>{p.val}</strong>
              <span style={{ color: 'var(--muted)' }}>{p.label}</span>
            </div>
          ))}
        </div>

        {/* State Filter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Filter by state:</span>
          <select
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              color: 'var(--text)',
              padding: '0.4rem 0.8rem',
              fontSize: '0.82rem',
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            <option value="">All India</option>
            {STATE_DATA.map(s => (
              <option key={s.state} value={s.state}>{s.state}</option>
            ))}
          </select>
          {selectedState && (
            <button
              onClick={() => setSelectedState('')}
              style={{
                padding: '0.4rem 0.8rem',
                background: 'rgba(232,76,30,0.1)',
                border: '1px solid rgba(232,76,30,0.2)',
                borderRadius: 8,
                color: 'var(--accent)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              ✕ Clear
            </button>
          )}
          <Toggle value={showPctDiff} onChange={setShowPctDiff} label="Show % change" />
        </div>

        {/* KPI CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.75rem',
        }}>
          <KPICard
            title="Avg Crime Rate"
            value={avgCrime}
            unit="per lakh"
            icon="🔴"
            color="var(--accent)"
            data={sd ? sd.rates : STATE_DATA.slice(0,10).map(s=>s.rates[2])}
            previous={showPctDiff ? parseFloat(avgCrime21) : undefined}
          />
          <KPICard
            title="Avg Literacy Rate"
            value={avgLiteracy}
            unit="%"
            icon="📚"
            color="var(--teal)"
            data={sd ? [sd.literacy, sd.literacy] : STATE_DATA.slice(0,10).map(s=>s.literacy)}
          />
          <KPICard
            title="Total Population"
            value={fmt(totalPop)}
            icon="👥"
            color="var(--blue)"
            data={STATE_DATA.slice(0,10).map(s=>s.pop/1e6)}
          />
          <KPICard
            title="Avg AQI"
            value={avgAQI || 'N/A'}
            icon="🌫️"
            color="var(--accent2)"
            data={CITY_AQI.slice(0,10).map(c=>c.aqi)}
          />
          {sd && (
            <KPICard
              title="Total Crimes 2023"
              value={sd.crimes[2].toLocaleString()}
              icon="⚠️"
              color="#a78bfa"
              data={sd.crimes}
              previous={showPctDiff ? sd.crimes[0] : undefined}
            />
          )}
        </div>
      </section>


      {/* TABLEAU DASHBOARD */}
      <section id="dashboard" style={{ ...sectionStyle, paddingTop: '1rem' }}>
        <SectionHeader title="Interactive Tableau Dashboard" />

        {/* Info bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: '12px 12px 0 0',
          padding: '0.75rem 1.25rem',
          borderBottom: 'none',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>CityLens Dashboard</span>
            <div style={{ width: 1, height: 14, background: 'var(--border2)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Crime · AQI · Literacy · Population</span>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {[
              { label: 'Interactive', color: 'var(--teal)' },
              { label: '2021–2023', color: 'var(--accent)' },
              { label: 'Tableau Public', color: 'var(--muted)' },
            ].map(chip => (
              <span key={chip.label} style={{
                padding: '0.2rem 0.6rem',
                borderRadius: 6,
                fontSize: '0.7rem',
                fontWeight: 600,
                background: `${chip.color}15`,
                border: `1px solid ${chip.color}30`,
                color: chip.color,
              }}>{chip.label}</span>
            ))}
          </div>
        </div>

        {/* Tableau embed */}
        <div style={{
          border: '1px solid var(--border)',
          borderRadius: '0 0 12px 12px',
          overflow: 'hidden',
        }}>
          <TableauEmbed />
        </div>

        {/* Hint bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginTop: '0.75rem',
          background: 'rgba(0,201,167,0.04)',
          border: '1px solid rgba(0,201,167,0.1)',
          borderRadius: 10,
          padding: '0.75rem 1.25rem',
        }}>
          {[
            { icon: '🖱️', text: 'Click a state on the map to filter all charts' },
            { icon: '🔄', text: 'Use the dropdown to switch indicators' },
            { icon: '↩️', text: 'Click empty space to reset to national view' },
            { icon: '📜', text: 'Scroll inside the dashboard for more charts' },
          ].map(hint => (
            <div key={hint.text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--muted2)' }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                background: 'rgba(0,201,167,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', flexShrink: 0,
              }}>{hint.icon}</div>
              <span dangerouslySetInnerHTML={{
                __html: hint.text.replace(/(.+?)( to .+)/, '<strong style="color:#f1f3fa">$1</strong>$2')
              }} />
            </div>
          ))}
        </div>
      </section>

      {/* DEEP DIVE */}
      <section id="deepdive" style={{ ...sectionStyle, paddingTop: '1rem' }}>
        <SectionHeader title="Deep Dive — State by State Analysis" />

        {/* State selector for deep dive */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Select a state to explore:</span>
          <select
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            style={{
              background: 'var(--card)', border: '1px solid var(--border)',
              borderRadius: 8, color: 'var(--text)', padding: '0.4rem 0.8rem',
              fontSize: '0.82rem', cursor: 'pointer', outline: 'none',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            <option value="">— Pick a state —</option>
            {STATE_DATA.map(s => <option key={s.state} value={s.state}>{s.state}</option>)}
          </select>
        </div>

        {!selectedState ? (
          /* No state selected — show all states comparison cards */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '0.75rem',
          }}>
            {STATE_DATA.map(s => {
              const sAvgAQI = getStateAvgAQI(s.state, CITY_AQI);
              const crimeChange = ((s.rates[2] - s.rates[0]) / s.rates[0] * 100).toFixed(1);
              const isUp = s.rates[2] > s.rates[0];
              return (
                <div
                  key={s.state}
                  onClick={() => setSelectedState(s.state)}
                  style={{
                    background: 'var(--card)', border: '1px solid var(--border)',
                    borderRadius: 12, padding: '1rem 1.25rem', cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    {s.state}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    {[
                      { label: 'Crime Rate', val: s.rates[2], color: 'var(--accent)' },
                      { label: 'Literacy', val: s.literacy + '%', color: 'var(--teal)' },
                      { label: 'Population', val: fmt(s.pop), color: 'var(--blue)' },
                      { label: 'Avg AQI', val: sAvgAQI || 'N/A', color: 'var(--accent2)' },
                    ].map(item => (
                      <div key={item.label}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: item.color }}>{item.val}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    marginTop: '0.75rem', paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border)',
                    fontSize: '0.72rem', fontWeight: 600,
                    color: isUp ? 'var(--accent)' : 'var(--teal)',
                  }}>
                    {isUp ? '△' : '▽'} Crime {isUp ? 'up' : 'down'} {Math.abs(crimeChange)}% since 2021
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* State selected — show full deep dive */
          (() => {
            const s = STATE_DATA.find(x => x.state === selectedState);
            if (!s) return null;
            const stateCities = getStateCities(selectedState, CITY_AQI);
            const sAvgAQI = getStateAvgAQI(selectedState, CITY_AQI);
            const crimeChange = ((s.rates[2] - s.rates[0]) / s.rates[0] * 100).toFixed(1);
            const isUp = s.rates[2] > s.rates[0];
            const maxRate = Math.max(...s.rates);

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* State header */}
                <div style={{
                  background: 'var(--card)', border: '1px solid var(--border)',
                  borderRadius: 14, padding: '1.5rem',
                  display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
                }}>
                  <div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.8rem', letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>
                      {selectedState}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>Population: {fmt(s.pop)} · Literacy: {s.literacy}%</div>
                  </div>
                  <div style={{
                    padding: '0.5rem 1rem', borderRadius: 10,
                    background: isUp ? 'rgba(232,76,30,0.1)' : 'rgba(0,201,167,0.1)',
                    border: `1px solid ${isUp ? 'rgba(232,76,30,0.2)' : 'rgba(0,201,167,0.2)'}`,
                    fontSize: '0.85rem', fontWeight: 700,
                    color: isUp ? 'var(--accent)' : 'var(--teal)',
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                  }}>
                    <span>{isUp ? '△' : '▽'}</span>
                    Crime {isUp ? 'increased' : 'decreased'} {Math.abs(crimeChange)}% from 2021→2023
                  </div>
                </div>

                {/* KPI row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
                  {[
                    { label: 'Crime Rate 2021', val: s.rates[0], color: 'var(--accent)', unit: '/lakh' },
                    { label: 'Crime Rate 2022', val: s.rates[1], color: 'var(--accent2)', unit: '/lakh' },
                    { label: 'Crime Rate 2023', val: s.rates[2], color: 'var(--accent)', unit: '/lakh' },
                    { label: 'Crimes 2023', val: s.crimes[2].toLocaleString(), color: '#a78bfa', unit: '' },
                    { label: 'Avg AQI', val: sAvgAQI || 'N/A', color: 'var(--accent2)', unit: '' },
                    { label: 'Literacy Rate', val: s.literacy + '%', color: 'var(--teal)', unit: '' },
                  ].map(item => (
                    <div key={item.label} style={{
                      background: 'var(--card)', border: '1px solid var(--border)',
                      borderRadius: 10, padding: '1rem',
                    }}>
                      <div style={{ fontSize: '0.68rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>{item.label}</div>
                      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: item.color, lineHeight: 1 }}>
                        {item.val}<span style={{ fontSize: '0.75rem', color: 'var(--muted)', marginLeft: '0.2rem' }}>{item.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Crime trend bars */}
                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.5rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '1.25rem' }}>
                    Crime Rate Trend (per lakh population)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {['2021', '2022', '2023'].map((yr, i) => {
                      const pct = (s.rates[i] / maxRate * 100).toFixed(0);
                      return (
                        <div key={yr} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--muted)', width: 32 }}>{yr}</span>
                          <div style={{ flex: 1, height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{
                              height: '100%', width: pct + '%',
                              background: i === 2 ? 'linear-gradient(90deg, var(--accent), var(--accent2))' : 'var(--border2)',
                              borderRadius: 4, transition: 'width 0.8s ease',
                            }} />
                          </div>
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: i === 2 ? 'var(--accent)' : 'var(--muted2)', width: 50, textAlign: 'right' }}>
                            {s.rates[i]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Cities AQI */}
                {stateCities.length > 0 && (
                  <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: '1.5rem' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--muted2)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '1rem' }}>
                      Cities by AQI
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {stateCities.map((c, i) => {
                        const maxAQI = stateCities[0].aqi;
                        const pct = (c.aqi / maxAQI * 100).toFixed(0);
                        return (
                          <div key={c.city} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--muted)', width: 16, textAlign: 'center' }}>{i + 1}</span>
                            <span style={{ fontSize: '0.82rem', minWidth: 150 }}>{c.city}</span>
                            <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{
                                height: '100%', width: pct + '%',
                                background: getAQIColor(c.aqi),
                                borderRadius: 3, transition: 'width 0.6s ease',
                              }} />
                            </div>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: getAQIColor(c.aqi), width: 45, textAlign: 'right' }}>{c.aqi}</span>
                            <span style={{ fontSize: '0.68rem', color: 'var(--muted)', width: 50 }}>{c.pollutant}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })()
        )}
      </section>

      {/* HOW TO USE */}
      <section id="about" style={{ ...sectionStyle, paddingTop: '1rem' }}>
        <SectionHeader title="How To Use" />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          overflow: 'hidden',
        }}>
          {[
            { num: '01', icon: '🎯', title: 'Pick an Indicator', text: 'Use the dropdown on the Tableau map to switch between Crime Rate, AQI, Literacy, or Population.' },
            { num: '02', icon: '🖱️', title: 'Click a State',     text: 'Click any state on the India map. Every chart updates instantly to show only that state\'s data.' },
            { num: '03', icon: '🔍', title: 'Explore Charts',    text: 'Scroll down inside the dashboard to see crime trends, city AQI, literacy distribution and more.' },
            { num: '04', icon: '↩️', title: 'Reset the View',    text: 'Click the same state again or click empty space on the map to return to the national overview.' },
          ].map((s, i, arr) => (
            <div
              key={s.num}
              style={{
                padding: '1.75rem',
                background: 'var(--card)',
                borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <div style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: '3rem',
                fontWeight: 800,
                color: 'rgba(255,255,255,0.04)',
                lineHeight: 1,
                marginBottom: '0.5rem',
              }}>{s.num}</div>
              <div style={{ fontSize: '1.3rem', marginBottom: '0.6rem' }}>{s.icon}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.4rem' }}>{s.title}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.6 }}>{s.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '1.5rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        maxWidth: 1400,
        margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.72rem', color: '#fff',
          }}>CL</div>
          <p style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
           <strong style={{ color: 'var(--accent)' }}>CityLens</strong> · Built by{' '}
<a href="https://www.linkedin.com/in/kushagra-srivastava-9a6613386/" target="_blank" rel="noreferrer"
  style={{ color: 'var(--teal)', textDecoration: 'none', fontWeight: 600 }}>
  Kushagra Srivastava
</a>
· Data: NCRB · Census 2011 · CPCB AQI
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['Portfolio Project', 'Data: 2021–2023', '36 States & UTs', 'Open Source'].map(tag => (
            <span key={tag} style={{
              fontSize: '0.7rem',
              padding: '0.25rem 0.6rem',
              borderRadius: 6,
              background: 'var(--card)',
              border: '1px solid var(--border)',
              color: 'var(--muted)',
            }}>{tag}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
