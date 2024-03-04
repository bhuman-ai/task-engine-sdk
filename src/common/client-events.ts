import { MouseButton, keyboardActions, mouseButtonActions } from "./base";
import { APICommand, RemoteCommand } from "./commands";
import { KeyInput } from "./key-inputs";
import { ServerEvents } from "./server-events";

export type ClientEvents = {
  setVariable: { name: string; value: string; save?: boolean };
  resume: {};
  setStepMode: { enable: boolean };
  keyboard: {
    page: string;
    action: (typeof keyboardActions)[number];
    key: KeyInput;
  };
  mouseButton: {
    page: string;
    action: (typeof mouseButtonActions)[number];
    button: MouseButton;
  };
  mouseMove: { page: string; x: number; y: number };
  mouseWheel: { page: string; deltaX: number; deltaY: number };
  reply: { message: string };
  closePage: { page: string };
  openPage: { url: string; page: string };
  exit: {};
  addCommands: {
    remoteCommands: RemoteCommand[];
    apiCommands: APICommand[];
  };
  removeCommands: {
    names: string[];
  };
  remoteCommandResponse: {
    name: string;
    response: string[];
  };
  evaluateRequest: {
    page: string;
    code: string;
  };
  screenshotRequest: {
    page: string;
  };
  hello: {
    secret: string;
    events: (keyof ServerEvents)[];
  };
  type: {
    page: string;
    text: string;
    delay: number;
  };
  opByText: {
    page: string;
    text: string;
    op: "click" | "scrollIntoView";
    xOffset: number;
    yOffset: number;
  };
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
  "openPage",
  "type",
  "opByText"
] as const satisfies readonly (keyof ClientEvents)[];
