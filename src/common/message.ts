export type MessageKind =
  | "prompt"
  | "screenshot"
  | "assistant"
  | "user"
  | "quality";

export type Message = {
  kind: MessageKind;
  usage?: number;
  content: string[];
  task?: string;
};
