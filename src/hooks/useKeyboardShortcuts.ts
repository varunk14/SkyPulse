"use client";

import { useEffect, useCallback, useState } from "react";

interface Shortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  action: () => void;
}

// Detect if device has a physical keyboard
function hasPhysicalKeyboard(): boolean {
  // Check if device is mobile/tablet
  if (typeof window === 'undefined') return true;
  
  // Check for touch capability
  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // If touch device, check if it's likely a tablet with keyboard
  // or if user has connected a keyboard
  if (hasTouchScreen) {
    // Check screen size - tablets are usually larger
    const isTablet = window.innerWidth >= 768;
    // For now, assume tablets might have keyboards, phones don't
    return isTablet;
  }
  
  // Desktop/laptop - definitely has keyboard
  return true;
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  const [hasKeyboard, setHasKeyboard] = useState(true);

  useEffect(() => {
    // Check on mount and on resize (for responsive changes)
    const checkKeyboard = () => {
      setHasKeyboard(hasPhysicalKeyboard());
    };
    
    checkKeyboard();
    window.addEventListener('resize', checkKeyboard);
    return () => window.removeEventListener('resize', checkKeyboard);
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Skip if device doesn't have physical keyboard
      if (!hasKeyboard) return;

      // Don't trigger if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        // Allow Escape in inputs
        if (event.key !== "Escape") return;
      }

      shortcuts.forEach((shortcut) => {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        
        // Handle ctrl/meta (both mean Cmd on Mac, Ctrl on Windows/Linux)
        const needsModifier = shortcut.ctrl || shortcut.meta;
        const hasModifier = event.ctrlKey || event.metaKey;
        const modifierMatch = needsModifier ? hasModifier : !hasModifier;
        
        // Handle shift - if shift is specified, it must match; if not specified, shift should not be pressed
        const shiftMatch = shortcut.shift !== undefined 
          ? (shortcut.shift === event.shiftKey)
          : !event.shiftKey;

        if (keyMatch && modifierMatch && shiftMatch) {
          event.preventDefault();
          shortcut.action();
        }
      });
    },
    [shortcuts, hasKeyboard]
  );

  useEffect(() => {
    if (!hasKeyboard) return;
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, hasKeyboard]);
}
