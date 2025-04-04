import { Session } from "next-auth";

export type Post = {
  username?: string;
  filePreview?: string | null;
  prompt?: string;
  summary: string;
  createdAt?: string;
  tags?: string[];
};

export type CreateAtAndUserName = {
  createdAt: string | undefined;
  username: string | undefined | null;
  usermail: string | undefined | null;
};

export type FilePreviewProps = {
  filePreview: string;
  prompt: string;
  createdAt: string | undefined;
  usermail: string | undefined | null;
  username: string | undefined;
};

export type ImageResponseRendererProps = {
  post: Post;
  src: string | undefined;
  usermail: string | undefined | null;
};

export type LoaderProps = {
  loading: boolean | undefined;
  summary: string;
};

export type ResponseHeaderProps = {
  prompt: string;
  post: Post;
  usermail: string | undefined | null;
};

export type ResponseRendererProps = {
  post: Post;
  usermail?: string | undefined | null;
  loading?: boolean;
  summaryRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
  childClassNames?: {
    container?: string;
    imageContainer?: string;
    heading?: string;
    textToSpeech?: string;
    markdown?: string;
  };
};

export type GeminiAiWrapperProps = {
  user: Session["user"];
  expressUrl: string;
  apiAuthToken: string;
  userId: string;
};

export type ImageResponseProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
};

export type DropdownProps = {
  title: string;
  itemsList: string[];
  onClick: (item: string) => void;
  setInputText?: (text: string) => void;
  loading?: boolean;
  stopSpeech?: () => void;
};
