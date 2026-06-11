import { Models } from "node-appwrite";

export type FileType = "document" | "image" | "video" | "audio" | "other";

export type RenameFile = {
  fileId: string;
  name: string;
  extension: string;
  path: string;
};

export type FileCardProps = {
  id: string;
  bgColor: string;
  imgSrc: string;
  title: string;
  allFiles: Models.DefaultRow[];
};

export type ActionItem = {
  label: string;
  value: string;
};

export type ShareFile = {
  fieldId: string;
  emails: string[];
  path: string;
};

export type DeleteFile = {
  fileId: string;
  bucketFileId: string;
  path: string;
};

export type CustomInputProps = {
  Icon: React.ComponentType;
  labelTitle: string;
  labelHtmlFor: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputName: string;
  classNames?: string;
};

export type IButtonLoadingProps = {
  loading: boolean;
  onClick: () => void;
  label?: string;
  classNames?: string;
};
