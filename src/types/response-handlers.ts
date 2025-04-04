import { Session, User } from "next-auth";

type SharedHandlerProps = {
  setLoading: (loading: boolean) => void;
  setSummary: (summary: string) => void;
  summaryRef: React.RefObject<HTMLDivElement | null>;
  setFileName: (fileName: string) => void;
  csrfToken: string | null;
  setTags: (tags: string[]) => void;
};

type SharedHistoryProps = {
  user: Session["user"];
  expressUrl: string;
  setPrompt: (text: string) => void;
  updateLocalHistory: (history: History[]) => void;
  localHistory: History[];
  apiAuthToken: string;
  userId: string;
  tags: string[];
  generateImageTag: boolean;
};

export type HandleSummarize = SharedHandlerProps &
  SharedHistoryProps & {
    input: string;
    setInputText: (text: string) => void;
  };

export type HandleImageResponse = SharedHandlerProps &
  SharedHistoryProps & {
    file: File | null;
    setFilePreview: (filePreview: string | null) => void;
    setFile: (file: File | null) => void;
    language: string;
  };

export type AddHistoryToDB = SharedHistoryProps & {
  data: string;
  input: string;
  filePreview?: string | null;
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
  likes: User[];
};
