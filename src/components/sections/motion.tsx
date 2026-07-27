'use client';
import { motion } from 'framer-motion';
export const MotionDiv = motion.div;
export const fadeUp = { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-80px' }, transition: { duration: .7, ease: 'easeOut' } };
