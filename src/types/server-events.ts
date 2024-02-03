import { Handler } from "./base";
import { ClientEvents } from "./client-events";
import { Message } from "./message";

export type ServerEvents = {
  message: Handler<{ message: Message }>;
  command: Handler<{ name: string; args: string[] }>;
  remoteCommandRequest: Handler<{
    name: string;
    args: string[];
  }>;
  getVariable: Handler<{ name: string }>;
  help: Handler<{ page: string }>;
  waitEvent: Handler<{ event: keyof ClientEvents }>;
  status: Handler<{
    status: "loading" | "running" | "completed" | "error" | "waiting";
  }>;
  addPage: Handler<{ page: string }>;
  removePage: Handler<{ page: string }>;
  evaluateResponse: Handler<{ page: string; result: unknown }>;
  screenshotResponse: Handler<{ page: string; data: string }>;
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
