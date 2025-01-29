import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type History = {
  _id?: string | undefined;
  historyId: string;
  email: string;
  prompt: string;
  response: string;
  filePreview?: string;
  createdAt?: string;
};

interface BearState {
  history: History[];
  updateHistory: (history: History[]) => void;

  isSpeechPaused: boolean;
  setIsSpeechPaused: (isPaused: boolean) => void;
  rateLimitMessage: string;
  setRateLimitMessage: (message: string) => void;
  fileName: string;
  setFileName: (fileName: string) => void;
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
        fileName: "",
        setFileName: (fileName) => set({ fileName: fileName }),
      }),
      {
        name: "global-store",
      },
    ),
  ),
);
