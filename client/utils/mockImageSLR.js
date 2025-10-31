const phrases = [
  "Hello", "Thank you", "Good morning", "Yes", "No",
  "Please", "Nice to meet you", "What is your name?", "See you soon",
  "I understand", "Could you repeat that?",
];

export async function predictFromImage(file) {
  // Simulate network/ML latency
  await new Promise((r) => setTimeout(r, 600));
  // Use a pseudo-random seed from file size/name to make results feel deterministic per image
  const seed = (file?.size || 1) + (file?.name?.length || 0);
  const idx = seed % phrases.length;
  return phrases[idx];
}
