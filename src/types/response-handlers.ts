import { Session, User } from "next-auth";

type SharedHandlerProps = {
  setLoading: (loading: boolean) => void;
  setSummary: (summary: string) => void;
  summaryRef: React.RefObject<HTMLDivElement | null>;
  setFileName: (fileName: string) => void;
  csrfToken: string | null;
  setTags: (tags: string[]) => void;
};

type SharedPostProps = {
  user: Session["user"];
  expressUrl: string;
  setPrompt: (text: string) => void;
  updateLocalPosts: (posts: Posts[]) => void;
  localPosts: Posts[];
  apiAuthToken: string;
  userId: string;
  tags: string[];
  generateImageTag: boolean;
};

export type HandleSummarize = SharedHandlerProps &
  SharedPostProps & {
    input: string;
    setInputText: (text: string) => void;
  };

export type HandleImageResponse = SharedHandlerProps &
  SharedPostProps & {
    file: File | null;
    setFilePreview: (filePreview: string | null) => void;
    setFile: (file: File | null) => void;
    language: string;
  };

export type AddPostsToDB = SharedPostProps & {
  data: string;
  input: string;
  filePreview?: string | null;
};

export type Posts = {
  _id?: string | undefined;
  user: {
    userId: string;
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  postId: string;
  prompt: string;
  response: string;
  responseType: string;
  filePreview?: string | null;
  createdAt?: string;
  tags: string[];
  likes: User[];
};
