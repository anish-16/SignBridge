const phrases = [
  "The other user is speaking now.",
  "I can hear you clearly.",
  "Let's schedule a meeting.",
  "Could you explain that again?",
  "That's interesting!",
  "I'm learning sign language.",
  "Please continue.",
];

export function generateMockSTT() {
  const pick = phrases[Math.floor(Math.random() * phrases.length)];
  return pick;
}

export function startMockSTT(onResult, everyMs = 2500) {
  const id = setInterval(() => onResult(generateMockSTT()), everyMs);
  return () => clearInterval(id);
}
