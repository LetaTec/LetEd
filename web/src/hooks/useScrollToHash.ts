import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Lazy pages render after navigation, so keep looking for the target section
// for a short while before giving up.
const SECTION_WAIT_MS = 3000;
// Content above the section (catalogue, images) can still grow after the
// first scroll; keep the section in place while the page settles.
const LAYOUT_SETTLE_MS = 1500;

// Router links do not scroll by themselves: a new page starts at the top,
// and a link with a #section scrolls to that section once it has rendered.
export const useScrollToHash = () => {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' });
    // Only on page changes; a removed hash (for example opening a topic
    // dialog) keeps the reader where they are.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // The location key re-runs this when the same section link is clicked again.
  const hashVisit = hash ? key : null;

  useEffect(() => {
    if (!hash) return undefined;

    const sectionId = decodeURIComponent(hash.slice(1));
    const startedAt = performance.now();
    let frame = 0;
    let settleTimer = 0;
    let resizeObserver: ResizeObserver | null = null;

    const followLayout = (section: HTMLElement) => {
      if (typeof ResizeObserver === 'undefined') return;

      resizeObserver = new ResizeObserver(() => section.scrollIntoView());
      resizeObserver.observe(document.body);
      settleTimer = window.setTimeout(
        () => resizeObserver?.disconnect(),
        LAYOUT_SETTLE_MS,
      );
    };

    const scrollWhenReady = () => {
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView();
        followLayout(section);
      } else if (performance.now() - startedAt < SECTION_WAIT_MS) {
        frame = requestAnimationFrame(scrollWhenReady);
      }
    };

    scrollWhenReady();

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settleTimer);
      resizeObserver?.disconnect();
    };
  }, [hash, hashVisit]);
};
