import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative os-card w-full max-w-md z-10 text-center"
          >
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>

            {/* Title */}
            <h2 className="text-lg font-semibold mb-2">{title}</h2>

            {/* Message */}
            <p className="text-sm opacity-70 mb-6">{message}</p>

            {/* Actions */}
            <div className="flex justify-center gap-3">
              <button onClick={onCancel} className="os-btn-outline">
                {cancelText}
              </button>

              <button
                onClick={onConfirm}
                className="os-btn-primary bg-red-600 hover:bg-red-700"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
