'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export function SiteLoader() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 700);
    return () => window.clearTimeout(timer);
  }, []);
  return <AnimatePresence>{visible && <motion.div className="fixed inset-0 z-[100] grid place-items-center bg-black" exit={{ opacity: 0 }} transition={{ duration: .5 }}><motion.div className="h-16 w-16 rounded-full border border-omega-gold/20 border-t-omega-gold" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }} /><span className="sr-only">Carregando</span></motion.div>}</AnimatePresence>;
}
