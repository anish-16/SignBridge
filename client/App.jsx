import "./global.css";
import { createRoot } from "react-dom/client";
import Home from "@/pages/Home.jsx";
import { ThemeProvider } from "@/context/ThemeContext.jsx";

function App() {
  return (
    <ThemeProvider>
      <Home />
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")).render(<App />);
