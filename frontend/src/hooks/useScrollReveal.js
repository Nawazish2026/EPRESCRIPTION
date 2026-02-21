import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook that uses IntersectionObserver to trigger
 * animations when an element scrolls into view.
 *
 * @param {Object} options
 * @param {number} options.threshold - Visibility threshold (0-1)
 * @param {string} options.rootMargin - Root margin for early/late trigger
 * @param {boolean} options.triggerOnce - If true, only trigger once
 * @returns {{ ref: React.RefObject, isVisible: boolean }}
 */
export function useScrollReveal({
  threshold = 0.15,
  rootMargin = '0px 0px -60px 0px',
  triggerOnce = true,
} = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}

/**
 * Animated counter hook — counts from 0 to `end` when `start` is true.
 *
 * @param {number} end - Target value
 * @param {boolean} start - Whether to start counting
 * @param {number} duration - Duration in ms
 * @param {string} suffix - Suffix like '+', '%', etc.
 * @returns {string} The current display value
 */
export function useCountUp(end, start, duration = 1800, suffix = '') {
  const [value, setValue] = useState('0');

  useEffect(() => {
    if (!start) return;

    // Parse numeric part
    const numericStr = String(end).replace(/[^0-9.]/g, '');
    const target = parseFloat(numericStr) || 0;
    const isDecimal = numericStr.includes('.');

    // Extract prefix/suffix from original end value
    const original = String(end);
    const prefix = original.match(/^[^0-9]*/)?.[0] || '';
    const trailingSuffix = original.match(/[^0-9.]*$/)?.[0] || '';

    let startTime = null;
    let rafId;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      const formatted = isDecimal ? current.toFixed(1) : Math.floor(current).toLocaleString();
      setValue(`${prefix}${formatted}${trailingSuffix}${suffix}`);

      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [end, start, duration, suffix]);

  return value;
}
