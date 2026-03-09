import { useState } from 'react';

const T = {
  "en-US": {
    pageTitle: "Life in weeks",
    pageSubtitle: "A simple visualization to reflect on the passage of time",
    birthDateQuestion: "Enter a birthdate",
    visualizeButton: "Visualize your time",
    startOverButton: "Start over",
    lifeInWeeksTitle: "Your life in weeks",
    weekHoverPast: " A week from your past",
    weekHoverCurrent: " Your current week",
    weekHoverFuture: " A week in your potential future",
    lifeHighlightsTitle: "Life highlights",
    societalContextTitle: "Societal context",
    cosmicPerspectiveTitle: "Cosmic perspective",
    naturalWorldTitle: "Natural world"
  }
};

const t = k => T['en-US'][k] || k;

const Icon = ({ d }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {d.map((p, i) => <path key={i} d={p} />)}
  </svg>
);

const SunIcon = () => <Icon d={["M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 7a5 5 0 100 10 5 5 0 000-10z"]} />;
const MoonIcon = () => <Icon d={["M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"]} />;

const Toggle = ({ dark, onToggle }) => (
  <button onClick={onToggle} style={{
    position: 'fixed', top: 16, right: 16, zIndex: 1000,
    width: 56, height: 28, borderRadius: 999, border: 'none', cursor: 'pointer', padding: 3,
    background: dark ? '#4f46e5' : '#e5e7eb',
    transition: 'background 0.4s', display: 'flex', alignItems: 'center'
  }}>
    <span style={{
      width: 22, height: 22, borderRadius: '50%',
      background: dark ? '#1e1b4b' : '#fff',
      transform: dark ? 'translateX(28px)' : 'translateX(0)',
      transition: 'transform 0.35s', display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: dark ? '#facc15' : '#f59e0b', boxShadow: '0 1px 4px rgba(0,0,0,0.25)'
    }}>{dark ? <MoonIcon /> : <SunIcon />}</span>
  </button>
);

export default function WeeksOfLife() {
  const [dark, setDark] = useState(false);
  const [step, setStep] = useState(1);
  const [birthdate, setBirthdate] = useState('');
  const [stats, setStats] = useState(null);
  const [hoverWeek, setHoverWeek] = useState(null);

  const theme = {
    bg: dark ? '#0f172a' : '#f9fafb',
    card: dark ? '#1e293b' : '#fff',
    text: dark ? '#e2e8f0' : '#374151',
    bold: dark ? '#f1f5f9' : '#111827',
    border: dark ? '#334155' : '#e5e7eb',
    btn: dark ? '#4f46e5' : '#1f2937',
    dotPast: dark ? '#94a3b8' : '#1f2937',
    dotFuture: dark ? '#334155' : '#e5e7eb'
  };

  const calc = d => {
    const b = new Date(d), t = new Date();
    const days = Math.floor((t - b) / 864e5);
    const weeks = Math.floor(days / 7);
    return {
      weeks, totalWeeks: 4160, days,
      pct: Math.round(weeks / 4160 * 100),
      sleep: days * 8, heart: days * 100800, breaths: days * 23040,
      seasons: Math.floor(days / 91.25), year: b.getFullYear()
    };
  };

  const pop = y => [2.5,3,3.7,4.4,5.3,6.1,6.9,7.8,8.1][Math.min(Math.floor((y-1950)/10),8)] + 'B';
  const fmt = n => new Intl.NumberFormat().format(n);

  const card = { background: theme.card, borderRadius: 10, padding: 24, marginTop: 24, border: `1px solid ${theme.border}`, boxShadow: dark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 1px 6px rgba(0,0,0,0.07)' };

  const Grid = () => {
    if (!stats) return null;
    const rows = [];
    for (let r = 0; r < 80; r++) {
      const cells = [];
      for (let c = 0; c < 52; c++) {
        const w = r * 52 + c;
        if (w >= 4160) break;
        const past = w < stats.weeks, cur = w === stats.weeks;
        cells.push(
          <div key={w} onMouseEnter={() => setHoverWeek(w)} onMouseLeave={() => setHoverWeek(null)}
            style={{
              width: 8, height: 8, margin: 2, borderRadius: 2, cursor: 'pointer',
              background: cur ? '#3b82f6' : past ? theme.dotPast : theme.dotFuture,
              animation: cur ? 'pulse 1.5s infinite' : 'none'
            }}
          />
        );
      }
      rows.push(<div key={r} style={{ display: 'flex' }}>{cells}</div>);
    }
    return (
      <div style={card}>
        <h2 style={{ color: theme.bold, fontWeight: 500, marginBottom: 16, fontSize: 16 }}>{t('lifeInWeeksTitle')}</h2>
        <div>{rows}</div>
        {hoverWeek !== null && (
          <div style={{ marginTop: 12, fontSize: 13, color: theme.text }}>
            Week {hoverWeek + 1}:{hoverWeek < stats.weeks ? t('weekHoverPast') : hoverWeek === stats.weeks ? t('weekHoverCurrent') : t('weekHoverFuture')}
          </div>
        )}
        <div style={{ display: 'flex', marginTop: 20, gap: 16, fontSize: 13 }}>
          {[[theme.dotPast,'Past'], ['#3b82f6','Present'], [theme.dotFuture,'Future']].map(([c,l]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
              <span style={{ color: theme.text }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const Section = ({ title, children }) => (
    <div style={card}>
      <h2 style={{ color: theme.bold, fontWeight: 500, marginBottom: 16, fontSize: 16 }}>{t(title)}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, color: theme.text, lineHeight: 1.7, fontSize: 14 }}>{children}</div>
    </div>
  );

  const B = ({ children }) => <span style={{ color: theme.bold, fontWeight: 600 }}>{children}</span>;

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, padding: '64px 24px 40px', transition: 'background 0.4s', fontFamily: 'system-ui' }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      <Toggle dark={dark} onToggle={() => setDark(d => !d)} />
      
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <h1 style={{ color: theme.bold, fontSize: 22, fontWeight: 400, marginBottom: 6 }}>{t('pageTitle')}</h1>
        <p style={{ color: theme.text, marginBottom: 32 }}>{t('pageSubtitle')}</p>

        {step === 1 ? (
          <div style={card}>
            <h2 style={{ color: theme.bold, fontWeight: 500, marginBottom: 16, fontSize: 16 }}>{t('birthDateQuestion')}</h2>
            <input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.bg, color: theme.bold, fontSize: 14, marginBottom: 14, outline: 'none', colorScheme: dark ? 'dark' : 'light' }}
            />
            <button onClick={() => { setStats(calc(birthdate)); setStep(2); }} disabled={!birthdate}
              style={{ width: '100%', padding: 10, borderRadius: 8, border: 'none', background: birthdate ? theme.btn : (dark ? '#334155' : '#d1d5db'), color: birthdate ? '#fff' : (dark ? '#64748b' : '#9ca3af'), fontSize: 14, cursor: birthdate ? 'pointer' : 'not-allowed' }}
            >{t('visualizeButton')}</button>
          </div>
        ) : (
          <>
            <Grid />
            <Section title="lifeHighlightsTitle">
              <p>You've lived <B>{fmt(stats.weeks)}</B> weeks, which is <B>{stats.pct}%</B> of a full life.</p>
              <p>That's <B>{fmt(stats.days)}</B> days of experience and approximately <B>{fmt(stats.seasons)}</B> seasons observed.</p>
              <p>Your heart has beaten approximately <B>{fmt(stats.heart)}</B> times.</p>
              <p>You've taken around <B>{fmt(stats.breaths)}</B> breaths and slept about <B>{fmt(stats.sleep)}</B> hours.</p>
            </Section>
            <Section title="societalContextTitle">
              <p>During your lifetime, humanity's population has grown from <B>{pop(stats.year)}</B> to over <B>8 billion</B> people.</p>
              <p>The average person will meet around <B>80,000</B> people. You've likely already met approximately <B>{fmt(Math.round(80000*stats.pct/100))}</B> individuals.</p>
              <p>Since your birth, humanity has collectively experienced approximately <B>{fmt(Math.round(stats.days*385000))}</B> births and <B>{fmt(Math.round(stats.days*166000))}</B> deaths.</p>
            </Section>
            <Section title="cosmicPerspectiveTitle">
              <p>Since your birth, Earth has traveled approximately <B>{fmt(Math.round(stats.days*1.6e6))}</B> kilometers through space.</p>
              <p>The observable universe is about <B>93</B> billion light-years across. Your entire lifespan is just <B>{(80/13.8e9*100).toFixed(10)}%</B> of the universe's age.</p>
              <p>During your lifetime, our solar system has moved about <B>{fmt(Math.round(stats.days*19872000))}</B> kilometers through the Milky Way.</p>
            </Section>
            <Section title="naturalWorldTitle">
              <p>You've experienced approximately <B>{fmt(Math.round(stats.days/29.53))}</B> lunar cycles and <B>{fmt(Math.floor(stats.days/365.25))}</B> trips around the Sun.</p>
              <p>A giant sequoia tree can live over 3,000 years. Your current age is <B>{((stats.days/365.25)/3000*100).toFixed(2)}%</B> of its potential lifespan.</p>
              <p>During your lifetime, your body has replaced most of its cells several times. You are not made of the same atoms you were born with.</p>
            </Section>
            <button onClick={() => { setBirthdate(''); setStats(null); setStep(1); }}
              style={{ width: '100%', marginTop: 24, padding: 10, borderRadius: 8, border: `1px solid ${theme.border}`, background: dark ? '#1e293b' : '#e5e7eb', color: theme.text, fontSize: 14, cursor: 'pointer' }}
            >{t('startOverButton')}</button>
          </>
        )}
      </div>
    </div>
  );
}