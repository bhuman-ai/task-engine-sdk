import { RemoteCommand, ServerEvents } from "../types";

export interface Config {
  clientId: string;
  clientSecret: string;
  engineSecret: string;

  authorization?: string;
  baseUrl?: string;
  fetch?: typeof fetch;
  WebSocket?: typeof WebSocket;
}

export type TaskEvents = ServerEvents & {
  socketClose: () => void;
  socketError: (event: Event) => void;
};

export type RemoteFunctionRun = (
  ...args: string[]
) => string[] | Promise<string[]>;

export type RemoteFunction = RemoteCommand & {
  run: RemoteFunctionRun;
};
