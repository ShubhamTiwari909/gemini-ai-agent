import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

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
}

export const useGlobalStore = create<BearState>()(
  devtools(
    persist(
      (set) => ({
        history: [],
        updateHistory: (history) => set({ history }),
        isSpeechPaused: true,
        setIsSpeechPaused: (isPaused) => set({ isSpeechPaused: isPaused }),
      }),
      {
        name: "global-storage",
      },
    ),
  ),
);
