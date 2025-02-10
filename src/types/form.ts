export type GenerateButtonProps = {
  stopSpeech: () => void;
  loading: boolean;
  handleSummarize: (item: string) => void;
  handleImageResponse: () => void;
  setPreview: React.Dispatch<React.SetStateAction<string | null>>;
  file: File | null;
};
export type FormControlsProps = {
  handleSummarize: (item: string) => void;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  file: File | null;
  handleImageResponse: () => void;
  setFilePreview: React.Dispatch<React.SetStateAction<string | null>>;
  className?: string;
};
