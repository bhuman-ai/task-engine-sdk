import { ClientEvents } from "./client-events";
import { Message } from "./message";

export type ServerEvents = {
  message: { message: Message };
  command: { name: string; args: string[] };
  remoteCommandRequest: {
    name: string;
    args: string[];
  };
  getVariable: { name: string };
  help: { page: string };
  waitEvent: { event: keyof ClientEvents };
  status: {
    status: "loading" | "running" | "completed" | "error" | "waiting";
  };
  addPage: { page: string };
  removePage: { page: string };
  evaluateResponse: { page: string; result: unknown };
  screenshotResponse: { page: string; data: string };
};

export const serverEvents = [
  "addPage",
  "command",
  "evaluateResponse",
  "getVariable",
  "help",
  "message",
  "remoteCommandRequest",
  "removePage",
  "screenshotResponse",
  "status",
  "waitEvent",
] as const satisfies readonly (keyof ServerEvents)[];
