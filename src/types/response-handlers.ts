import { User } from "next-auth";

type SharedHandlerProps = {
  setLoading: (loading: boolean) => void;
  setSummary: (summary: string) => void;
  summaryRef: React.RefObject<HTMLDivElement | null>;
  setFileName: (fileName: string) => void;
  csrfToken: string | null;
  setTags: (tags: string[]) => void;
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
  tags: string[];
  generateImageTag: boolean;
};

export type History = {
  _id?: string | undefined;
  user: {
    userId: string;
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  historyId: string;
  prompt: string;
  response: string;
  responseType: string;
  filePreview?: string | null;
  createdAt?: string;
  tags: string[];
};
