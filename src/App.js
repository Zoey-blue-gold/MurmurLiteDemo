import { useState, useEffect, useCallback, useMemo } from 'react';
import { Copy, Check, Shield, Scale, Zap } from 'lucide-react';
import './theme.css';
import './App.css';
import AmbientGlow from './components/AmbientGlow';
import LivingOrb, { ORB_STATES } from './components/LivingOrb';
import ScenarioStack from './components/ScenarioStack';
import { SCENES, GOALS, COPY, BADGE_META } from './config/content';
import { mockGenerate } from './api/mockGenerate';

const BADGE_ICONS = {
  安全版: Shield,
  平衡版: Scale,
  直接版: Zap,
};

function App() {
  console.log("🔥 APP RENDERING");
  const [scene, setScene] = useState(SCENES[0].id);
  const [goal, setGoal] = useState('');
  const [input, setInput] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [orbComplete, setOrbComplete] = useState(false);
  const [orbDispatched, setOrbDispatched] = useState(false);

  const canGenerate = Boolean(scene && goal && input.trim());
  const isTyping = input.trim().length > 0;
  const typingIntensity = Math.min(input.trim().length / 120, 1);
  const glowPhase = loading ? 'processing' : 'receptive';

  useEffect(() => {
    if (results && !loading) {
      setOrbComplete(true);
      const t = setTimeout(() => setOrbComplete(false), 1400);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [results, loading]);

  const orbState = useMemo(() => {
    if (orbDispatched) return ORB_STATES.DISPATCHED;
    if (loading) return ORB_STATES.GENERATING;
    if (orbComplete) return ORB_STATES.COMPLETE;
    if (isTyping || inputFocused) return ORB_STATES.TYPING;
    return ORB_STATES.IDLE;
  }, [orbDispatched, loading, orbComplete, isTyping, inputFocused]);

  const handleGenerate = async () => {
  console.log("🔥 CLICK GENERATE BUTTON");

  if (!canGenerate || loading) return;
  setLoading(true);
  setResults(null);
  setCopiedIdx(null);

  try {
    const data = await mockGenerate({ input: input.trim() });
    setResults(data);
  } finally {
    setLoading(false);
  }
};

  const handleCopy = useCallback(async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopiedIdx(idx);
    setShowModal(true);
  }, []);

  const handleSent = () => {
    setShowModal(false);
    setOrbDispatched(true);
    setTimeout(() => setOrbDispatched(false), 800);
  };

  return (
    <div className="murmur-page">
      <main className="murmur-shell">
        <header className="murmur-header">
          <span className="header-glow-dot" aria-hidden="true" />
          <span className="murmur-brand">Murmur</span>
        </header>

        <section className="hero-section">
          <AmbientGlow variant="orb" phase={glowPhase}>
            <LivingOrb state={orbState} typingIntensity={typingIntensity} />
          </AmbientGlow>
          <p className="tagline">{COPY.tagline}</p>
        </section>

        <section className="helpers-section">
          <div className="helper-block">
            <p className="helper-label">{COPY.sceneSection}</p>
            <ScenarioStack scenes={SCENES} value={scene} onChange={setScene} />
          </div>

          <div className="helper-block">
            <p className="helper-label">{COPY.goalSection}</p>
            <div className="goal-tags">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  className={`goal-tag${goal === g.id ? ' goal-tag--active' : ''}`}
                  onClick={() => setGoal(g.id)}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="input-section">
          <AmbientGlow variant="input" phase={glowPhase}>
            <div className={`input-panel${inputFocused ? ' input-panel--focused' : ''}`}>
              <textarea
                className="ethereal-input"
                placeholder={COPY.inputPlaceholder}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                rows={4}
              />
              <button
                type="button"
                className="generate-btn"
                disabled={!canGenerate || loading}
                onClick={handleGenerate}
              >
                <span>{loading ? COPY.generating : COPY.generate}</span>
                <span className="generate-arrow">→</span>
              </button>
            </div>
          </AmbientGlow>
        </section>

        {results && (
  <section className="results-section">
    <p className="results-intro">{COPY.resultsIntro}</p>

    {results.map((card, idx) => {
      const badge = BADGE_META[card.tag] ?? BADGE_META["安全版"];
      const BadgeIcon = BADGE_ICONS[card.tag] ?? Shield;
      const isCopied = copiedIdx === idx;

      return (
        <article
          key={card.tag}
          className="result-card"
          style={{ animationDelay: `${0.05 + idx * 0.1}s` }}
        >
          <div className="result-card-top">
            <span className={`result-badge ${badge.className}`}>
              <BadgeIcon size={12} strokeWidth={2.5} />
              {badge.label}
            </span>

            <button
              type="button"
              className={`copy-icon-btn${
                isCopied ? " copy-icon-btn--done" : ""
              }`}
              onClick={() => handleCopy(card.content, idx)}
              aria-label="复制"
            >
              {isCopied ? (
                <Check size={16} strokeWidth={2.5} />
              ) : (
                <Copy size={16} strokeWidth={2} />
              )}
            </button>
          </div>

          <p className="result-text">
            {card.content}
          </p>

          {card.explanation && (
            <p className="result-explanation">
              {card.explanation}
            </p>
          )}
        </article>
      );
    })}
  </section>
)}

        {showModal && (
          <div className="modal-root" role="dialog" aria-modal="true">
            <button type="button" className="modal-overlay" onClick={() => setShowModal(false)} aria-label="关闭" />
            <div className="modal-sheet">
              <p className="modal-title">{COPY.modalTitle}</p>
              <button type="button" className="modal-btn modal-btn--sent" onClick={handleSent}>
                {COPY.modalSent}
              </button>
              <button type="button" className="modal-btn modal-btn--ghost" onClick={() => setShowModal(false)}>
                {COPY.modalNot}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
