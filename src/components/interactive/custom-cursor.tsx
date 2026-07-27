'use client';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [desktop, setDesktop] = useState(false);
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 28 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 28 });
  useEffect(() => {
    setDesktop(window.matchMedia('(pointer: fine)').matches);
    const move = (event: PointerEvent) => { x.set(event.clientX - 12); y.set(event.clientY - 12); };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, [x, y]);
  if (!desktop) return null;
  return <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-6 w-6 rounded-full border border-omega-gold/60 mix-blend-difference md:block" style={{ x, y }} />;
}
