import { useInView } from 'react-intersection-observer';

export function useAnimateOnScroll(threshold = 0.1) {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: true,
  });

  return { ref, inView };
}
