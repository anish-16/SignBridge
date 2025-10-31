export function speak(text, enabled = true) {
  if (!enabled) return;
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1;
  utter.pitch = 1;
  utter.lang = "en-US";
  window.speechSynthesis.speak(utter);
}
