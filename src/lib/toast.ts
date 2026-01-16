'use client';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

// Simple toast implementation (you can enhance this with a library like sonner)
export function showToast(type: ToastType, options: ToastOptions) {
  // For now, use browser's built-in notification
  // In production, you'd use a proper toast library
  console.log(`[${type.toUpperCase()}] ${options.title}`, options.description);
  
  // You can install 'sonner' for better toasts:
  // npm install sonner
  // import { toast } from 'sonner'
  // toast.success(options.title)
}

export const toast = {
  success: (options: ToastOptions) => showToast('success', options),
  error: (options: ToastOptions) => showToast('error', options),
  info: (options: ToastOptions) => showToast('info', options),
  warning: (options: ToastOptions) => showToast('warning', options),
};
