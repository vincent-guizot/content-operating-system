import { useEffect } from "react";
import { CheckCircle, XCircle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast({
  show,
  type = "info",
  message,
  duration = 3000,
  onClose,
}) {
  useEffect(() => {
    if (!show) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [show, duration, onClose]);

  const styles = {
    success: {
      icon: <CheckCircle className="w-5 h-5" />,
      bg: "bg-green-600",
    },
    error: {
      icon: <XCircle className="w-5 h-5" />,
      bg: "bg-red-600",
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      bg: "bg-blue-600",
    },
  };

  const current = styles[type];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white ${current.bg}`}
        >
          {current.icon}

          <span className="text-sm">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
