export type GenerateButtonProps = {
  stopSpeech: () => void;
  loading: boolean;
  handleSummarize: (item: string) => void;
  handleImageResponse: () => void;
  file: File | null;
};
export type FormControlsProps = {
  handleSummarize: (item: string) => void;
  file: File | null;
  handleImageResponse: () => void;
  className?: string;
};
