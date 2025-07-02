import { Session, User } from "next-auth";
import { Comments } from "./response-handlers";

export type Post = {
  user?: User & { userId?: string };
  filePreview?: string | null;
  prompt?: string;
  summary?: string;
  createdAt?: string;
  tags?: string[];
  views?: User[];
  likes?: User[];
  postId?: string;
  comments?: Comments[];
};

export type CreateAtAndUserName = {
  createdAt: string | undefined;
  username: string | undefined | null;
  userId: string | undefined | null;
};

export type FilePreviewProps = {
  filePreview: string;
  prompt: string;
};

export type ImageResponseRendererProps = {
  prompt: string;
  src: string | undefined;
  renderImage?: boolean;
  postId: string;
  downloads: number | undefined;
  showDownload?: boolean;
};

export type LoaderProps = {
  loading: boolean | undefined;
  summary: string;
};

export type ResponseHeaderProps = {
  prompt: string;
  post: Post;
  user: User;
  showViews?: boolean;
  showLikes?: boolean;
};

export type ResponseRendererProps = {
  post: Post;
  usermail?: string | undefined | null;
  loading?: boolean;
  summaryRef: React.RefObject<HTMLDivElement | null>;
  showHeader?: boolean;
  showViews?: boolean;
  showLikes?: boolean;
  className?: string;
  user?: User;
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
  loading?: boolean;
  stopSpeech?: () => void;
};
