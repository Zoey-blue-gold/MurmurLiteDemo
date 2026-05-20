import './AmbientGlow.css';

/**
 * Localized breathing aurora — wraps orb or input, not full viewport.
 */
/** phase: receptive | processing — both use purple aura only */
export default function AmbientGlow({ variant = 'orb', phase = 'receptive', children }) {
  const safePhase = phase === 'processing' ? 'processing' : 'receptive';
  return (
    <div className={`ambient-zone ambient-zone--${variant} ambient-zone--phase-${safePhase}`}>
      <div className="ambient-aurora ambient-aurora--a" aria-hidden="true" />
      <div className="ambient-aurora ambient-aurora--b" aria-hidden="true" />
      <div className="ambient-zone-content">{children}</div>
    </div>
  );
}
