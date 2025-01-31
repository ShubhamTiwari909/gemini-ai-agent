import { History } from "@/types/response-handlers";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface BearState {
  history: History[];
  updateHistory: (history: History[]) => void;
  isSpeechPaused: boolean;
  setIsSpeechPaused: (isPaused: boolean) => void;
  rateLimitMessage: string;
  setRateLimitMessage: (message: string) => void;
  fileName: string;
  setFileName: (fileName: string) => void;
  summary: string;
  setSummary: (summary: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useGlobalStore = create<BearState>()(
  devtools((set) => ({
    history: [],
    updateHistory: (history) => set({ history }),
    isSpeechPaused: true,
    setIsSpeechPaused: (isPaused) => set({ isSpeechPaused: isPaused }),
    rateLimitMessage: "",
    setRateLimitMessage: (message) => set({ rateLimitMessage: message }),
    fileName: "",
    setFileName: (fileName) => set({ fileName: fileName }),
    summary: "",
    setSummary: (summary) => set({ summary: summary }),
    loading: false,
    setLoading: (loading) => set({ loading: loading }),
  })),
);
