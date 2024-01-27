export type MessageKind = "prompt" | "screenshot" | "assistant" | "user";

export type Message = {
  kind: MessageKind;
  usage?: number;
  content: string[];
};
