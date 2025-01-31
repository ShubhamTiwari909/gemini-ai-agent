import { User } from "next-auth";
import { Dispatch } from "react";

type SharedHandlerProps = {
  setLoading: (loading: boolean) => void;
  setSummary: (summary: string) => void;
  summaryRef: React.RefObject<HTMLDivElement | null>;
  setFileName: (fileName: string) => void;
};

export type HandleSummarize = SharedHandlerProps & {
  input: string;
};

export type HandleImageResponse = SharedHandlerProps & {
  file: File | null;
  setFilePreview: (filePreview: string | null) => void;
  setFile: (file: File | null) => void;
};

export type AddHistoryToDB = {
  data: { summary: string };
  input: string;
  updateLocalHistory: (history: History[]) => void;
  localHistory: History[];
  expressUrl: string;
  setPrompt: Dispatch<React.SetStateAction<string>>;
  user?: User;
  filePreview?: string | null;
};

export type History = {
  _id?: string | undefined;
  historyId: string;
  email: string;
  prompt: string;
  response: string;
  filePreview?: string | null;
  createdAt?: string;
};
