export type Note = {
  id: number;
  title: string;
  content?: string;
  labels: number[];
  isArchived: boolean;
  type: "text" | "checklist" | "image";
  items?: { text: string; checked: boolean }[];
  image?: string;
};

export type NoteLabel = {
  id: number;
  title: string;
  color: string;
};
