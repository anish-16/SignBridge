import { useCallback, useMemo, useState } from "react";
import VideoCall from "@/components/VideoCall";
import ContactsModal from "@/components/ContactsModal";
import ImageTranslate from "@/components/ImageTranslate.jsx";
import { useTheme } from "@/context/ThemeContext.jsx";
import { useSignTranslation } from "@/hooks/useSignTranslation.js";
import { speak } from "@/utils/mockTTS";
import { generateMockSTT } from "@/utils/mockSTT";

export default function Home() {
  const { theme, toggleTheme, userId } = useTheme();
  const [inCallWith, setInCallWith] = useState("");
  const [contactsOpen, setContactsOpen] = useState(false);

  const [signCaptions, setSignCaptions] = useState([]);
  const [speechCaptions, setSpeechCaptions] = useState([]);

  const [detecting, setDetecting] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(true);

  const addSign = useCallback((text) => {
    setSignCaptions((prev) => [...prev.slice(-20), text]);
    speak(text, ttsEnabled);
  }, [ttsEnabled]);

  const addSpeech = useCallback((text) => {
    setSpeechCaptions((prev) => [...prev.slice(-20), text]);
  }, []);

  useSignTranslation(detecting, addSign, 1500);

  const startSpeaking = useCallback(() => {
    const text = generateMockSTT();
    addSpeech(text);
  }, [addSpeech]);

  const combined = useMemo(() => ({
    local: signCaptions,
    remote: speechCaptions,
  }), [signCaptions, speechCaptions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-zinc-100 dark:from-zinc-950 dark:to-zinc-900">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/60 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center text-white font-bold">SL</div>
            <div>
              <div className="text-xs text-zinc-500">Real-time Sign Translator</div>
              <div className="font-semibold">LingoBridge</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground hover:opacity-90 text-sm"
              onClick={() => setDetecting((d) => !d)}
              aria-pressed={detecting}
            >
              {detecting ? "Pause Detection" : "Resume Detection"}
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground hover:opacity-90 text-sm"
              onClick={() => setTtsEnabled((v) => !v)}
              aria-pressed={ttsEnabled}
            >
              {ttsEnabled ? "Mute TTS" : "Unmute TTS"}
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground hover:opacity-90 text-sm"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <VideoCall
          localCaptions={combined.local}
          remoteCaptions={combined.remote}
          onStartSpeaking={startSpeaking}
          onOpenContacts={() => setContactsOpen(true)}
          inCallWith={inCallWith}
          userId={userId}
        />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl p-4 ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur">
            <h4 className="font-semibold mb-2">Sign → Text → Speech</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">Simulated real-time sign detection generates captions and optional TTS.</p>
          </div>
          <div className="rounded-2xl p-4 ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur">
            <h4 className="font-semibold mb-2">Speech → Text</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">Use the Start Speaking button to simulate STT from the hearing user.</p>
          </div>
        </div>

        <div className="mt-6">
          <ImageTranslate />
        </div>
      </main>

      <ContactsModal
        open={contactsOpen}
        onClose={() => setContactsOpen(false)}
        onCall={(id) => setInCallWith(id)}
      />
    </div>
  );
}
