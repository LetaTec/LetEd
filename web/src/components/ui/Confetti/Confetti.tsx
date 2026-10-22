import { useEffect, useRef } from 'react';
import cx from 'classnames/bind';

import styles from './Confetti.module.css';

const cn = cx.bind(styles);

// Confetti colours come from the design tokens.
const COLOR_TOKENS = [
  '--color-brand-yellow',
  '--color-illus-teal',
  '--color-illus-rust',
  '--color-illus-sky',
  '--color-illus-blush',
  '--color-accent',
];

const PIECES_PER_POPPER = 70;
const DURATION_MS = 3200;
const GRAVITY = 0.22;
const DRAG = 0.985;

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  spin: number;
  color: string;
  round: boolean;
};

export type ConfettiProps = {
  // Change this number to fire a burst; 0 never fires.
  burst: number;
  className?: string;
};

// Two party poppers fire confetti up from the bottom corners of the
// container. Decorative, and skipped entirely for reduced motion.
export const Confetti = ({ burst, className }: ConfettiProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (
      !canvas ||
      burst === 0 ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined;
    }
    const context = canvas.getContext('2d');
    if (!context) return undefined;

    const ratio = window.devicePixelRatio || 1;
    const { clientWidth: width, clientHeight: height } = canvas;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.scale(ratio, ratio);

    const style = getComputedStyle(canvas);
    const colors = COLOR_TOKENS.map(token =>
      style.getPropertyValue(token).trim(),
    );

    const pieces: Piece[] = [-1, 1].flatMap(side =>
      Array.from({ length: PIECES_PER_POPPER }, (_, index) => {
        // Each popper fires up and in towards the middle
        const angle = (-Math.PI / 2) * (0.55 + Math.random() * 0.4);
        const speed = 9 + Math.random() * 8;
        return {
          x: side < 0 ? 0 : width,
          y: height,
          vx: Math.cos(angle) * speed * -side,
          vy: Math.sin(angle) * speed,
          size: 5 + Math.random() * 6,
          rotation: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.3,
          color: colors[index % colors.length],
          round: index % 4 === 0,
        };
      }),
    );

    const startedAt = performance.now();
    let frame = 0;

    const draw = (now: number) => {
      const elapsed = now - startedAt;
      context.clearRect(0, 0, width, height);
      context.globalAlpha = Math.max(0, 1 - elapsed / DURATION_MS);

      pieces.forEach(piece => {
        piece.vx *= DRAG;
        piece.vy = piece.vy * DRAG + GRAVITY;
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.rotation += piece.spin;

        context.save();
        context.translate(piece.x, piece.y);
        context.rotate(piece.rotation);
        context.fillStyle = piece.color;
        if (piece.round) {
          context.beginPath();
          context.arc(0, 0, piece.size / 2, 0, Math.PI * 2);
          context.fill();
        } else {
          context.fillRect(
            -piece.size / 2,
            -piece.size / 4,
            piece.size,
            piece.size / 2,
          );
        }
        context.restore();
      });

      if (elapsed < DURATION_MS) frame = requestAnimationFrame(draw);
      else context.clearRect(0, 0, width, height);
    };

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [burst]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('confetti', className)}
      aria-hidden="true"
    />
  );
};
