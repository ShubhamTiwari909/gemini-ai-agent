import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type History = {
  historyId: string;
  email: string;
  prompt: string;
  response: string;
};

interface BearState {
  history: History[];
  updateHistory: (history: History[]) => void;
}

export const useGlobalStore = create<BearState>()(
  devtools(
    persist(
      (set) => ({
        history: [],
        updateHistory: (history) => set({ history }),
      }),
      {
        name: "global-storage",
      },
    ),
  ),
);
