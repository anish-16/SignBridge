import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { db, ensureAuth, firebaseReady, APP_ID } from "@/firebase/config";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [userId, setUserId] = useState("local-anon");
  const [loading, setLoading] = useState(true);

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  // Init auth and subscribe to preferences
  useEffect(() => {
    let unsub = null;
    let isMounted = true;
    const token = window.__initial_auth_token || undefined;
    (async () => {
      try {
        const { userId: uid } = await ensureAuth(token);
        if (!isMounted) return;
        setUserId(uid);
        if (firebaseReady) {
          const prefRef = doc(db, `artifacts/${APP_ID}/users/${uid}/preferences`);
          unsub = onSnapshot(prefRef, async (snap) => {
            const data = snap.data();
            if (data?.theme === "light" || data?.theme === "dark") {
              setTheme(data.theme);
            } else {
              await setDoc(prefRef, { theme: "light" }, { merge: true });
              setTheme("light");
            }
            setLoading(false);
          });
        } else {
          // Fallback to localStorage when Firebase isn't configured
          const stored = localStorage.getItem("theme-preference");
          if (stored === "dark" || stored === "light") setTheme(stored);
          setLoading(false);
        }
      } catch (e) {
        console.error("Auth error", e);
        setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
      if (unsub) unsub();
    };
  }, []);

  const value = useMemo(() => ({
    theme,
    userId,
    loading,
    toggleTheme: async () => {
      const next = theme === "dark" ? "light" : "dark";
      setTheme(next);
      if (firebaseReady) {
        try {
          const prefRef = doc(db, `artifacts/${APP_ID}/users/${userId}/preferences`);
          await setDoc(prefRef, { theme: next }, { merge: true });
        } catch (e) {
          console.error("Failed to persist theme", e);
        }
      } else {
        localStorage.setItem("theme-preference", next);
      }
    },
  }), [theme, userId]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
