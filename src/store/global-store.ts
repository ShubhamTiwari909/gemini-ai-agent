import { Posts } from "@/types/response-handlers";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type Src = {
  inlineData: {
    data: string;
  };
}[];

interface GlobalState {
  inputText: string;
  setInputText: (text: string) => void;
  generateImageTag: boolean;
  setGenerateImageTag: (tag: boolean) => void;
  prompt: string;
  setPrompt: (text: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  filePreview: string | null;
  setFilePreview: (preview: string | null) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  posts: Posts[];
  updatePosts: (posts: Posts[]) => void;
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

export const useGlobalStore = create<GlobalState>()(
  devtools((set) => ({
    inputText: "",
    setInputText: (text) => set({ inputText: text }),
    generateImageTag: false,
    setGenerateImageTag: (tag) => set({ generateImageTag: tag }),
    prompt: "",
    setPrompt: (text) => set({ prompt: text }),
    file: null,
    setFile: (file) => set({ file }),
    filePreview: null,
    setFilePreview: (preview) => set({ filePreview: preview }),
    tags: [],
    setTags: (tags) => set({ tags }),
    posts: [],
    updatePosts: (posts: Posts[]) => set({ posts }),
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
    showCommentsGlobal: false,
  })),
);
