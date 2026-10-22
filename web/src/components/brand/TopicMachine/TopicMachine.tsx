import { useEffect, useRef, useState } from 'react';
import cx from 'classnames/bind';

import { StudentsIllustration } from '@components/brand/StudentsIllustration/StudentsIllustration';
import {
  LANDING_TEXT,
  TOPIC_MACHINE_TEXT,
  TOPIC_PREVIEWS,
} from '@constants/landing';

import type {
  TopicMachineContent,
  TopicMachinePalette,
  TopicMachineScene,
} from './topicMachineScene';
import styles from './TopicMachine.module.css';

const cn = cx.bind(styles);

// Colours come from the design tokens, so the 3D scene matches the brand.
const PALETTE_TOKENS: Record<keyof TopicMachinePalette, string> = {
  ink: '--color-text-primary',
  machine: '--color-bg-inverse',
  accent: '--color-accent',
  gold: '--color-illus-gold',
  teal: '--color-illus-teal',
  sage: '--color-illus-sage',
  rust: '--color-illus-rust',
  paper: '--color-bg-page',
  border: '--color-border-base',
  muted: '--color-text-muted',
  positive: '--color-status-positive',
  brand: '--color-brand-yellow',
};

const FONTS = { serif: 'Cormorant Garamond', sans: 'DM Sans' } as const;
const FONT_FACES = [
  `600 96px "${FONTS.serif}"`,
  `italic 600 96px "${FONTS.serif}"`,
  `500 96px "${FONTS.serif}"`,
  `600 34px "${FONTS.sans}"`,
  `700 76px "${FONTS.sans}"`,
];
// Words are drawn into textures, so wait briefly for the web fonts.
const FONT_WAIT_MS = 1500;

const readPalette = (element: HTMLElement): TopicMachinePalette => {
  const style = getComputedStyle(element);
  return Object.fromEntries(
    Object.entries(PALETTE_TOKENS).map(([key, token]) => [
      key,
      style.getPropertyValue(token).trim(),
    ]),
  ) as TopicMachinePalette;
};

const loadFonts = () =>
  Promise.race([
    Promise.all(FONT_FACES.map(face => document.fonts.load(face))),
    new Promise(resolve => window.setTimeout(resolve, FONT_WAIT_MS)),
  ]);

const CONTENT: Omit<TopicMachineContent, 'fonts'> = {
  words: TOPIC_MACHINE_TEXT.inputWords,
  topics: TOPIC_PREVIEWS.map(topic => ({
    title: topic.title,
    label: TOPIC_MACHINE_TEXT.cardLabel(topic.level),
  })),
  status: TOPIC_MACHINE_TEXT.cardStatus,
};

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export type TopicMachineProps = {
  className?: string;
};

// Sign-in animation: subject words go into the SriDha machine and come out
// as ready topics. three.js loads only once the scene is on screen (never on
// phones, where it is hidden), pauses off screen or in a background tab, and
// stays still for reduced motion. Without WebGL the student illustration
// is shown instead.
export const TopicMachine = ({ className }: TopicMachineProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    let scene: TopicMachineScene | null = null;
    let isVisible = false;
    let isCancelled = false;
    let isLoading = false;

    const sync = () => {
      if (!scene) return;
      if (isVisible && !document.hidden) scene.start();
      else scene.stop();
    };

    const load = async () => {
      isLoading = true;
      try {
        const [{ createTopicMachineScene }] = await Promise.all([
          import('./topicMachineScene'),
          loadFonts(),
        ]);
        if (isCancelled) return;
        scene = createTopicMachineScene(
          canvas,
          readPalette(canvas),
          { ...CONTENT, fonts: FONTS },
          { animate: !prefersReducedMotion() },
        );
        setIsReady(true);
        sync();
      } catch (error) {
        console.warn('[topic-machine] 3D scene unavailable', error);
        if (!isCancelled) setHasFailed(true);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !scene && !isLoading) void load();
      sync();
    });
    observer.observe(canvas);
    document.addEventListener('visibilitychange', sync);

    return () => {
      isCancelled = true;
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      scene?.dispose();
    };
  }, []);

  if (hasFailed) {
    return (
      <StudentsIllustration
        label={LANDING_TEXT.illustrationLabel}
        className={className}
      />
    );
  }

  return (
    <div
      className={cn('stage', { ready: isReady }, className)}
      role="img"
      aria-label={TOPIC_MACHINE_TEXT.label}
    >
      <canvas ref={canvasRef} className={cn('canvas')} />
    </div>
  );
};
