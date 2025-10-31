// CRITICAL MODEL HOOK: this is the entry point to integrate a real SLR model.
// Replace the implementation of fetchSignTranslation to call your model API.
export async function fetchSignTranslation(videoFrameData) {
  const phrases = [
    "Hello", "Thank you", "How are you?", "Yes", "No",
    "Please", "Good morning", "Nice to meet you", "I understand",
    "Could you repeat that?", "What is your name?", "See you soon",
  ];
  const pick = phrases[Math.floor(Math.random() * phrases.length)];
  await new Promise((r) => setTimeout(r, 250));
  return pick;
}

import { useEffect, useRef } from "react";
export function useSignTranslation(active, onResult, intervalMs = 1500) {
  const timer = useRef(null);
  useEffect(() => {
    if (!active) return;
    timer.current = setInterval(async () => {
      try {
        const text = await fetchSignTranslation({});
        onResult?.(text);
      } catch (e) {
        console.error("SLR mock failed", e);
      }
    }, intervalMs);
    return () => {
      if (timer.current) clearInterval(timer.current);
      timer.current = null;
    };
  }, [active, onResult, intervalMs]);
}
