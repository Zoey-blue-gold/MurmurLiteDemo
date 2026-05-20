import { useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './ScenarioStack.css';

function stackOrder(index, activeIndex, length) {
  return (index - activeIndex + length) % length;
}

export default function ScenarioStack({ scenes, value, onChange }) {
  const len = scenes.length;
  const initialIndex = Math.max(0, scenes.findIndex((s) => s.id === value));

  const [activeIndex, setActiveIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const dragX = useMotionValue(0);
  const rotateZ = useTransform(dragX, [-120, 0, 120], [-6, 0, 6]);

  useEffect(() => {
    const idx = scenes.findIndex((s) => s.id === value);
    if (idx >= 0 && idx !== activeIndex) setActiveIndex(idx);
  }, [value, scenes, activeIndex]);

  const goTo = useCallback(
    (index) => {
      const next = ((index % len) + len) % len;
      setActiveIndex(next);
      onChange(scenes[next].id);
      animate(dragX, 0, { duration: 0.25 });
    },
    [len, scenes, onChange, dragX]
  );

  const goNext = () => goTo(activeIndex + 1);
  const goPrev = () => goTo(activeIndex - 1);

  const handleDragEnd = (_, info) => {
    if (info.offset.x < -72) goNext();
    else if (info.offset.x > 72) goPrev();
    animate(dragX, 0, { type: 'spring', stiffness: 380, damping: 28 });
  };

  return (
    <div className="scenario-stack-wrap">
      <div className="scenario-stack" aria-label="选择对话场景">
        {scenes.map((scene, i) => {
          const order = stackOrder(i, activeIndex, len);
          const isFront = order === 0;
          const Icon = scene.Icon;

          return (
            <motion.button
              key={scene.id}
              type="button"
              layout
              className={`scenario-card${isFront ? ' scenario-card--front' : ''}`}
              style={
                isFront
                  ? { zIndex: 10, pointerEvents: 'auto', x: dragX, rotateZ }
                  : { zIndex: 10 - order, pointerEvents: 'none' }
              }
              initial={false}
              animate={{
                scale: 1 - order * 0.04,
                y: order * 10,
                x: isFront ? 0 : order * 4,
                opacity: 1 - order * 0.22,
                rotateZ: isFront ? 0 : order % 2 === 0 ? -2.5 : 2.5,
              }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              drag={isFront ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={isFront ? handleDragEnd : undefined}
              onClick={() => isFront && onChange(scene.id)}
              aria-pressed={value === scene.id}
              tabIndex={isFront ? 0 : -1}
            >
              <span className="scenario-card-icon" style={{ background: scene.tint }}>
                <Icon size={22} strokeWidth={1.75} color={scene.color} />
              </span>
              <span className="scenario-card-label">{scene.label}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="scenario-stack-controls">
        <button type="button" className="scenario-nav-btn" onClick={goPrev} aria-label="上一个场景">
          <ChevronLeft size={18} />
        </button>
        <div className="scenario-dots" role="tablist">
          {scenes.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              className={`scenario-dot${i === activeIndex ? ' scenario-dot--active' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <button type="button" className="scenario-nav-btn" onClick={goNext} aria-label="下一个场景">
          <ChevronRight size={18} />
        </button>
      </div>
      <p className="scenario-swipe-hint">左右滑动切换场景</p>
    </div>
  );
}
