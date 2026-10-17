import { useEffect, useRef } from 'react';
import cx from 'classnames/bind';

import styles from './ScrollProgress.module.css';

const cn = cx.bind(styles);

// Thin reading-progress bar along the top edge. Writes a CSS variable once per
// animation frame instead of re-rendering React on every scroll event.
export const ScrollProgress = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      barRef.current?.style.setProperty(
        '--scroll-progress',
        String(Math.min(Math.max(progress, 0), 1)),
      );
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return <div ref={barRef} className={cn('bar')} aria-hidden="true" />;
};
