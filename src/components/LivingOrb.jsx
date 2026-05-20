import './LivingOrb.css';

export const ORB_STATES = {
  IDLE: 'idle',
  TYPING: 'typing',
  GENERATING: 'generating',
  COMPLETE: 'complete',
  DISPATCHED: 'dispatched',
};

const STROKE = '#6B6280';

function EyesOpen() {
  return (
    <svg className="orb-face" viewBox="0 0 52 20" aria-hidden="true">
      <circle cx="14" cy="10" r="3.2" fill={STROKE} opacity="0.82" />
      <circle cx="38" cy="10" r="3.2" fill={STROKE} opacity="0.82" />
      <circle cx="13" cy="9" r="0.9" fill="#fff" opacity="0.45" />
      <circle cx="37" cy="9" r="0.9" fill="#fff" opacity="0.45" />
    </svg>
  );
}

function OrbFace({ state }) {
  switch (state) {
    case ORB_STATES.TYPING:
    case ORB_STATES.IDLE:
      return <EyesOpen />;
    case ORB_STATES.GENERATING:
      return (
        <svg className="orb-face" viewBox="0 0 52 20" aria-hidden="true">
          <circle cx="14" cy="10" r="3" fill={STROKE} opacity="0.8" />
          <path d="M28 10 Q32 9 36 10" stroke={STROKE} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.75" />
        </svg>
      );
    case ORB_STATES.COMPLETE:
      return (
        <svg className="orb-face" viewBox="0 0 52 20" aria-hidden="true">
          <path d="M8 11 Q14 7 20 11" stroke={STROKE} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M32 11 Q38 7 44 11" stroke={STROKE} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
        </svg>
      );
    case ORB_STATES.DISPATCHED: {
      const star = (cx, cy) =>
        `M${cx} ${cy - 3} L${cx + 0.9} ${cy - 0.7} L${cx + 3} ${cy - 0.7} L${cx + 1.2} ${cy + 1} L${cx + 1.8} ${cy + 3.2} L${cx} ${cy + 1.8} L${cx - 1.8} ${cy + 3.2} L${cx - 1.2} ${cy + 1} L${cx - 3} ${cy - 0.7} L${cx - 0.9} ${cy - 0.7} Z`;
      return (
        <svg className="orb-face" viewBox="0 0 52 20" aria-hidden="true">
          <path d={star(14, 10)} fill={STROKE} opacity="0.9" />
          <path d={star(38, 10)} fill={STROKE} opacity="0.9" />
        </svg>
      );
    }
    default:
      return <EyesOpen />;
  }
}

export default function LivingOrb({
  state = ORB_STATES.IDLE,
  typingIntensity = 0,
}) {
  const isTyping = state === ORB_STATES.TYPING;
  const pulseSpeed = Math.max(1.2, 2.8 - typingIntensity * 1.6);

  return (
    <div
      className={`orb-stage orb-stage--${state}`}
      style={{
        '--typing-intensity': typingIntensity,
        '--pulse-duration': `${pulseSpeed}s`,
      }}
    >
      {state === ORB_STATES.DISPATCHED && (
        <div className="orb-ripples" aria-hidden="true">
          <span className="orb-ripple" />
          <span className="orb-ripple orb-ripple--2" />
          <span className="orb-ripple orb-ripple--3" />
        </div>
      )}
      <div className="orb-halo" aria-hidden="true" />
      {state === ORB_STATES.GENERATING && <div className="orb-mesh" aria-hidden="true" />}
      <div className={`orb-sphere${isTyping ? ' orb-sphere--typing' : ''}`}>
        {isTyping && <div className="orb-surface-wave" aria-hidden="true" />}
        <div className="orb-inner-glow" aria-hidden="true" />
        <div className="orb-specular" aria-hidden="true" />
        <OrbFace state={state} />
      </div>
    </div>
  );
}
