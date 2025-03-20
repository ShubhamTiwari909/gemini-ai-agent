import { User } from "next-auth";

type SharedHandlerProps = {
  setLoading: (loading: boolean) => void;
  setSummary: (summary: string) => void;
  summaryRef: React.RefObject<HTMLDivElement | null>;
  setFileName: (fileName: string) => void;
  csrfToken: string | null;
};

export type HandleSummarize = SharedHandlerProps & {
  input: string;
};

export type HandleImageResponse = SharedHandlerProps & {
  file: File | null;
  setFilePreview: (filePreview: string | null) => void;
  setFile: (file: File | null) => void;
  language: string;
};

export type AddHistoryToDB = {
  data: { summary: string };
  input: string;
  updateLocalHistory: (history: History[]) => void;
  localHistory: History[];
  expressUrl: string;
  setPrompt: (text: string) => void;
  user?: User;
  filePreview?: string | null;
  apiAuthToken: string;
  userId: string;
};

export type History = {
  _id?: string | undefined;
  username?: string;
  historyId: string;
  email: string;
  prompt: string;
  response: string;
  filePreview?: string | null;
  createdAt?: string;
  userId: string;
};
