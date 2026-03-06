import { useEffect, useState } from "react";
import { Bell, Settings, User } from "lucide-react";

export default function TopBar() {
  return (
    <header className="os-topbar">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <img src="/os-logo.png" alt="Orange Scrolls" className="w-8 h-8" />

        {/* <h1 className="font-bold text-lg">Orange Scrolls</h1> */}
      </div>

      {/* CENTER */}
      <TypewriterText text="Content Operating System..." />

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <IconButton>
          <Bell size={18} />
        </IconButton>

        <IconButton>
          <Settings size={18} />
        </IconButton>

        <IconButton>
          <User size={18} />
        </IconButton>
      </div>
    </header>
  );
}

/* =========================
   TYPEWRITER COMPONENT
========================= */

function TypewriterText({ text }) {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;

    if (!isDeleting && index < text.length) {
      timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 50);
    } else if (!isDeleting && index === text.length) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 10500); // pause setelah selesai
    } else if (isDeleting && index > 0) {
      timeout = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1));
        setIndex((prev) => prev - 1);
      }, 25);
    } else if (isDeleting && index === 0) {
      setIsDeleting(false);
    }

    return () => clearTimeout(timeout);
  }, [index, isDeleting, text]);

  return (
    <div className="text-sm opacity-80 tracking-wide">
      {displayText}
      <span className="animate-pulse">|</span>
    </div>
  );
}

/* =========================
   ICON BUTTON
========================= */

function IconButton({ children }) {
  return (
    <button
      className="
      p-2
      rounded
      hover:bg-[#e7d6b2]
      transition
      "
    >
      {children}
    </button>
  );
}
