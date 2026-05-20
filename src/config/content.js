import { Home, Building2, MessageCircle, Heart } from 'lucide-react';

/** 场景卡：4 项，无副标题 */
export const SCENES = [
  { id: 'family', Icon: Home, label: '家庭', tint: '#fbf7f2', color: '#8a7d6e' },
  { id: 'friend', Icon: MessageCircle, label: '朋友', tint: '#f2f7f4', color: '#5a7a65' },
  { id: 'authority', Icon: Building2, label: '职场/权威', tint: '#f2f4f8', color: '#5c6b82' },
  { id: 'crush', Icon: Heart, label: 'Crush', tint: '#fbf2f5', color: '#9e6b7a' },
];

export const GOALS = [
  { id: 'no', label: '拒绝' },
  { id: 'reply', label: '回复' },
  { id: 'initiate', label: '主动开口' },
  { id: 'stuck', label: '不知道说什么' },
];

export const COPY = {
  tagline: '说粗糙也没关系，我来帮你整理',
  sceneSection: '我想和谁说…',
  goalSection: '我想…',
  inputPlaceholder:
    '比如：朋友约我这周末喝咖啡，但我其实只想一个人待着充充电……',
  generate: '帮我组织语言',
  generating: '正在理清…',
  resultsIntro: '从感受到表达，这是为你梳理的三种说法',
  modalTitle: '你发出去了吗？',
  modalSent: '发出去了 ✓',
  modalNot: '还没有',
};

export const BADGE_META = {
  安全版: { label: '安全版', className: 'badge-safe' },
  平衡版: { label: '平衡版', className: 'badge-balanced' },
  直接版: { label: '直接版', className: 'badge-direct' },
};
