import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

type History = {
  historyId: string;
  email: string;
  prompt: string;
  response: string;
  filePreview?: string;
};

interface BearState {
  history: History[];
  updateHistory: (history: History[]) => void;
  isSpeechPaused: boolean;
  setIsSpeechPaused: (isPaused: boolean) => void;
  rateLimitMessage: string;
  setRateLimitMessage: (message: string) => void;
}

export const useGlobalStore = create<BearState>()(
  devtools(
    persist(
      (set) => ({
        history: [],
        updateHistory: (history) => set({ history }),
        isSpeechPaused: true,
        setIsSpeechPaused: (isPaused) => set({ isSpeechPaused: isPaused }),
        rateLimitMessage: "",
        setRateLimitMessage: (message) => set({ rateLimitMessage: message }),
      }),
      {
        name: "global-storage",
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  ),
);
