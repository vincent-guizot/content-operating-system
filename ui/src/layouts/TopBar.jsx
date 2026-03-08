import { useEffect, useState } from "react";
import { Bell, Palette } from "lucide-react";

export default function TopBar() {
  const [theme, setTheme] = useState("classic");

  // Load theme saat pertama kali render
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "classic";
    setTheme(savedTheme);

    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);

    document.documentElement.setAttribute("data-theme", selectedTheme);
    localStorage.setItem("theme", selectedTheme);
  };

  return (
    <header className="os-topbar">
      {/* LEFT */}

      <div className="flex items-center gap-3">
        <img src="/os-logo.png" alt="Orange Scrolls" className="w-8 h-8" />
      </div>

      {/* CENTER */}

      <TypewriterText text="Content Operating System..." />

      {/* RIGHT */}

      <div className="flex items-center gap-3">
        {/* THEME DROPDOWN */}

        <div className="relative flex items-center">
          <Palette size={18} className="absolute left-2 pointer-events-none" />

          <select
            value={theme}
            onChange={handleThemeChange}
            className="
              appearance-none
              pl-7
              pr-4
              py-1
              text-sm
              bg-transparent
              border
              border-[var(--os-border-main)]
              rounded
              cursor-pointer
              hover:bg-[var(--os-nav-hover)]
            "
          >
            <option value="classic">Classic</option>
            <option value="modern">Modern</option>
          </select>
        </div>

        {/* NOTIFICATIONS */}

        <button
          disabled
          className="
            relative
            p-2
            rounded
            opacity-60
            cursor-not-allowed
          "
        >
          <Bell size={18} />

          <span
            className="
              absolute
              -top-1
              -right-1
              text-[9px]
              bg-orange-500
              text-white
              px-1
              rounded
            "
          >
            Soon
          </span>
        </button>
      </div>
    </header>
  );
}

/* =========================
   TYPEWRITER
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
      }, 3000);
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
    <div className="text-sm opacity-80 tracking-wide font-medium">
      {displayText}
      <span className="animate-pulse ml-1">|</span>
    </div>
  );
}
