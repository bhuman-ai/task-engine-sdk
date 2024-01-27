import {
  Handler,
  MouseButton,
  keyboardActions,
  mouseButtonActions,
} from "./base";
import { APICommand, RemoteCommand } from "./commands";
import { KeyInput } from "./key-inputs";
import { ServerEvents } from "./server-events";

export type ClientEvents = {
  setVariable: Handler<{ name: string; value: string; save?: boolean }>;
  resume: Handler<{}>;
  setStepMode: Handler<{ enable: boolean }>;
  keyboard: Handler<{
    page: string;
    action: (typeof keyboardActions)[number];
    key: KeyInput;
  }>;
  mouseButton: Handler<{
    page: string;
    action: (typeof mouseButtonActions)[number];
    button: MouseButton;
  }>;
  mouseMove: Handler<{ page: string; x: number; y: number }>;
  mouseWheel: Handler<{ page: string; deltaX: number; deltaY: number }>;
  reply: Handler<{ message: string }>;
  closePage: Handler<{ page: string }>;
  exit: Handler<{}>;
  addCommands: Handler<{
    remoteCommands: RemoteCommand[];
    apiCommands: APICommand[];
  }>;
  removeCommands: Handler<{
    names: string[];
  }>;
  remoteCommandResponse: Handler<{
    name: string;
    response: string[];
  }>;
  evaluateRequest: Handler<{
    page: string;
    code: string;
  }>;
  screenshotRequest: Handler<{
    page: string;
  }>;
  hello: Handler<{
    type: string;
    secret: string;
    events: (keyof ServerEvents)[];
  }>;
};

export const clientEvents = [
  "addCommands",
  "closePage",
  "evaluateRequest",
  "exit",
  "hello",
  "keyboard",
  "mouseButton",
  "mouseMove",
  "mouseWheel",
  "remoteCommandResponse",
  "removeCommands",
  "reply",
  "resume",
  "screenshotRequest",
  "setStepMode",
  "setVariable",
] as const satisfies readonly (keyof ClientEvents)[];
