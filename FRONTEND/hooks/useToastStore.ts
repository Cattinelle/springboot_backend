import { create } from "zustand";

export type ToastType = "success" | "info" | "error" | "default";

interface ToastState {
  visible: boolean;
  type: ToastType;
  title?: string;
  message?: string;
  points?: string[];
  duration?: number;
  buttonText?: string;
  buttonOnPress?: () => void;
  onDismiss?: () => void;
  timerId?: NodeJS.Timeout | null;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  icon?: React.ReactNode;
  showToast: (toast: {
    type?: ToastType;
    title?: string;
    message?: string;
    points?: string[];
    duration?: number;
    buttonText?: string;
    onDismiss?: () => void;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    icon?: React.ReactNode;
    buttonOnPress?: () => void;
  }) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  visible: false,
  type: "default",
  title: undefined,
  message: undefined,
  points: undefined,
  duration: undefined,
  buttonText: undefined,
  onDismiss: undefined,
  timerId: null,
  buttonOnPress: undefined,
  icon: undefined,
  showToast: ({
    type = "default",
    title,
    message,
    points,
    duration,
    buttonText,
    onDismiss,
    backgroundColor,
    borderColor,
    textColor,
    icon,
    buttonOnPress,
  }) => {
    // Clear any existing timer
    const { timerId } = get();
    if (timerId) clearTimeout(timerId);
    let newTimerId: ReturnType<typeof setTimeout> | null = null;
    if (duration && duration > 0) {
      newTimerId = setTimeout(() => {
        get().hideToast();
      }, duration);
    }
    set({
      visible: true,
      type,
      title,
      message,
      points,
      duration,
      buttonText,
      onDismiss,
      timerId: newTimerId as unknown as NodeJS.Timeout,
      backgroundColor,
      borderColor,
      textColor,
      icon,
      buttonOnPress,
    });
  },
  hideToast: () => {
    const { timerId, onDismiss } = get();
    if (timerId) clearTimeout(timerId);
    set({
      visible: false,
      type: "default",
      title: undefined,
      message: undefined,
      points: undefined,
      duration: undefined,
      buttonText: undefined,
      onDismiss: undefined,
      timerId: null,
      icon: undefined,
    });
    if (onDismiss) onDismiss();
  },
}));
