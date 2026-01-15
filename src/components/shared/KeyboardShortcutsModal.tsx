"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Command } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { keys: ["/"], description: "Focus search" },
  { keys: ["Esc"], description: "Close modal / Clear focus" },
  { keys: ["Shift", "?"], description: "Show keyboard shortcuts" },
  { keys: ["⌘", "K"], description: "Quick search", note: "Mac: ⌘K, Windows/Linux: Ctrl+K" },
  { keys: ["F"], description: "Toggle filters (on results page)" },
  { keys: ["S"], description: "Share search URL" },
];

export function KeyboardShortcutsModal({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-50 w-full max-w-md overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                <Command className="h-5 w-5" />
                Keyboard Shortcuts
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Close keyboard shortcuts"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
              {shortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0"
                >
                  <div className="flex flex-col">
                    <span className="text-gray-600 dark:text-gray-300">
                      {shortcut.description}
                    </span>
                    {shortcut.note && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {shortcut.note}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, i) => (
                      <kbd
                        key={i}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono font-medium text-gray-700 dark:text-gray-300"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-600 rounded text-xs">?</kbd> anytime to show this</p>
              <p className="text-xs mt-1 text-gray-400 dark:text-gray-500">
                Note: Keyboard shortcuts work on devices with physical keyboards (laptops, desktops, tablets with keyboards)
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
