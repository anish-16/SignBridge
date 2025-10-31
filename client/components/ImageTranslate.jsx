import { useRef, useState } from "react";
import { speak } from "@/utils/mockTTS";
import { predictFromImage } from "@/utils/mockImageSLR";

export default function ImageTranslate() {
  const inputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [tts, setTts] = useState(true);

  const onFile = async (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setLoading(true);
    try {
      const text = await predictFromImage(file);
      setResult(text);
      speak(text, tts);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl p-4 ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold">Image → Text {tts ? "→ Speech" : ""}</h4>
        <div className="flex items-center gap-2">
          <button onClick={() => setTts((v)=>!v)} className="px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground text-sm">
            {tts ? "Mute TTS" : "Unmute TTS"}
          </button>
          <button onClick={() => inputRef.current?.click()} className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm">
            Upload Image
          </button>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e)=>onFile(e.target.files?.[0])} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="aspect-video rounded-xl overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-800 grid place-items-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
          {imageUrl ? (
            <img src={imageUrl} alt="uploaded" className="w-full h-full object-contain" />
          ) : (
            <div className="text-sm text-zinc-500">No image selected</div>
          )}
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-sm text-zinc-600 dark:text-zinc-300">Detected text</div>
          <div className="mt-2 text-lg font-semibold min-h-12">
            {loading ? "Analyzing..." : (result || "—")}
          </div>
        </div>
      </div>
    </div>
  );
}
