import { Session, User } from "next-auth";

type SharedPostProps = {
  expressUrl: string;
  user: Session["user"];
  setPrompt: (text: string) => void;
  updateLocalPosts: (posts: Posts[]) => void;
  apiAuthToken: string;
  localPosts: Posts[];
  userId: string;
  tags: string[];
  generateImageTag: boolean;
};

export type HandleSummarize = {
  input: string;
  csrfToken: string | null;
};

export type HandleImageResponse = {
  file: File | null;
  csrfToken: string | null;
  language: string;
  base64String: string;
};

export type AddPostsToDB = SharedPostProps & {
  data: string;
  input: string;
  filePreview?: string | null;
};

export type Replies = {
  id: string;
  text: string;
  user: User;
  likes: User[];
};

export type Comments = {
  id: string;
  text: string;
  user: User;
  likes: User[];
  replies: Replies[];
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
  views: User[];
  comments: Comments[];
};
