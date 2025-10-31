import { useEffect, useState } from "react";
import { db, firebaseReady, APP_ID } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default function ContactsModal({ open, onClose, onCall }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        if (firebaseReady) {
          const col = collection(db, `artifacts/${APP_ID}/public/data/contacts`);
          const snap = await getDocs(col);
          const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          if (!cancelled) setContacts(list);
        } else {
          setContacts([
            { id: "user_alex" },
            { id: "user_bailey" },
            { id: "user_casey" },
            { id: "user_devon" },
          ]);
        }
      } catch (e) {
        console.error("Failed to load contacts", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    if (open) load();
    return () => {
      cancelled = true;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-xl bg-white dark:bg-zinc-900 p-6 shadow-2xl mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Contacts</h3>
          <button
            className="p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {loading ? (
          <div className="text-sm text-zinc-500">Loading...</div>
        ) : contacts.length === 0 ? (
          <div className="text-sm text-zinc-500">No contacts found.</div>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {contacts.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-800 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent text-white grid place-items-center text-xs font-bold">
                    {c.id.slice(0,2).toUpperCase()}
                  </div>
                  <div className="text-sm font-medium">{c.id}</div>
                </div>
                <button
                  onClick={() => { onCall?.(c.id); onClose?.(); }}
                  className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:opacity-90 text-sm"
                >
                  Call
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
