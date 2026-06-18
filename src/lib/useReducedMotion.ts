'use client';
import { useReducedMotion as useFramerReducedMotion } from 'motion/react';

export function useReducedMotion(): boolean {
  const prefersReduced = useFramerReducedMotion();
  return prefersReduced ?? false;
}
