import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  LayoutDashboard,
  Folder,
  FileText,
  Layers,
  Tag,
  Image,
  ChevronDown,
  ChevronRight,
  List,
  Plus,
} from "lucide-react";

export default function LeftBar() {
  return (
    <aside className="os-sidebar">
      {/* LOGO */}
      <div className="flex items-center gap-3 mb-6">
        <img src="/os-logo.png" className="w-10" />
        <div>
          <p className="font-bold">Orange Scrolls</p>
          <p className="text-xs opacity-70">Content OS</p>
        </div>
      </div>

      <nav className="space-y-1 text-sm">
        {/* DASHBOARD */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `os-nav flex items-center gap-2 ${isActive ? "os-nav-active" : ""}`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <DropdownMenu
          icon={<Folder size={18} />}
          label="Brands"
          basePath="/brands"
          items={[
            { label: "List", icon: <List size={16} />, path: "/brands" },
            {
              label: "Create",
              icon: <Plus size={16} />,
              path: "/brands/create",
            },
          ]}
        />

        <DropdownMenu
          icon={<FileText size={18} />}
          label="Articles"
          basePath="/articles"
          items={[
            { label: "List", icon: <List size={16} />, path: "/articles" },
            {
              label: "Create",
              icon: <Plus size={16} />,
              path: "/articles/create",
            },
          ]}
        />

        <DropdownMenu
          icon={<Layers size={18} />}
          label="Categories"
          basePath="/categories"
          items={[
            { label: "List", icon: <List size={16} />, path: "/categories" },
            {
              label: "Create",
              icon: <Plus size={16} />,
              path: "/categories/create",
            },
          ]}
        />

        <DropdownMenu
          icon={<Tag size={18} />}
          label="Tags"
          basePath="/tags"
          items={[
            { label: "List", icon: <List size={16} />, path: "/tags" },
            { label: "Create", icon: <Plus size={16} />, path: "/tags/create" },
          ]}
        />

        <DropdownMenu
          icon={<Image size={18} />}
          label="Media"
          basePath="/media"
          items={[
            { label: "Library", icon: <Image size={16} />, path: "/media" },
          ]}
        />
      </nav>
    </aside>
  );
}
function DropdownMenu({ icon, label, items, basePath }) {
  const location = useLocation();

  const isRouteInside = location.pathname.startsWith(basePath);

  const [open, setOpen] = useState(isRouteInside);

  useEffect(() => {
    if (isRouteInside) {
      setOpen(true);
    }
  }, [location.pathname]);

  return (
    <div>
      {/* PARENT MENU (tidak ada active bg) */}
      <button
        onClick={() => setOpen(!open)}
        className="os-nav flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2">
          {icon}
          {label}
        </div>

        {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden ml-6"
          >
            {items.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 py-1 text-sm os-nav ${
                    isActive ? "os-nav-active" : ""
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
