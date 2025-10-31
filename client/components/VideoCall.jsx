import { useEffect, useRef } from "react";

function useMockStream(colors = ["#7c3aed", "#2563eb"]) {
  const videoRef = useRef(null);
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1280; canvas.height = 720;
    const ctx = canvas.getContext("2d");
    let raf;
    let t = 0;
    const draw = () => {
      const w = canvas.width, h = canvas.height;
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, colors[0]);
      g.addColorStop(1, colors[1]);
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      const cx = w/2 + Math.sin(t/30)*w/4;
      const cy = h/2 + Math.cos(t/40)*h/4;
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.beginPath(); ctx.arc(cx, cy, 120 + 60*Math.sin(t/20), 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(40+20*Math.sin(t/10), h-120, 280, 60);
      t++;
      raf = requestAnimationFrame(draw);
    };
    draw();
    const stream = canvas.captureStream(30);
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
    return () => { cancelAnimationFrame(raf); const tracks = stream.getTracks(); tracks.forEach(tr => tr.stop()); };
  }, [colors.join(",")]);
  return videoRef;
}

export default function VideoCall({
  localCaptions = [],
  remoteCaptions = [],
  onStartSpeaking,
  onOpenContacts,
  inCallWith,
  userId,
}) {
  const localVideo = useMockStream(["#7c3aed","#2563eb"]);
  const remoteVideo = useMockStream(["#06b6d4","#22c55e"]);

  const combined = [...localCaptions.slice(-5), ...remoteCaptions.slice(-5)];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center text-white font-bold">SL</div>
          <div>
            <div className="text-sm text-zinc-500">Signed in as</div>
            <div className="text-base font-semibold">{userId}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onOpenContacts} className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:opacity-90">Contacts</button>
          <button onClick={onStartSpeaking} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90">Start Speaking</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative rounded-2xl overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-800 shadow-xl">
          <video ref={localVideo} muted playsInline className="w-full aspect-video object-cover bg-zinc-900" />
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
            <div className="text-xs uppercase tracking-wider opacity-80">Local User</div>
            <div className="mt-1 text-sm leading-snug line-clamp-3">
              {localCaptions.slice(-3).map((c, i) => (
                <div key={i} className="opacity-95">{c}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden ring-1 ring-zinc-200 dark:ring-zinc-800 shadow-xl">
          <video ref={remoteVideo} muted playsInline className="w-full aspect-video object-cover bg-zinc-900" />
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
            <div className="text-xs uppercase tracking-wider opacity-80">Remote User {inCallWith ? `• ${inCallWith}` : ""}</div>
            <div className="mt-1 text-sm leading-snug line-clamp-3">
              {remoteCaptions.slice(-3).map((c, i) => (
                <div key={i} className="opacity-95">{c}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-zinc-600 dark:text-zinc-300">
            Status: {inCallWith ? `In Call with ${inCallWith}` : "Idle"}
          </div>
          <div className="flex items-center gap-2 text-sm">
            {combined.map((c, i) => (
              <span key={i} className="px-2 py-1 rounded-full bg-secondary text-secondary-foreground">{c}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
