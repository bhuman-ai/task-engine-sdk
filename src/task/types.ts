import { RemoteCommand, ServerEvents } from "../common";

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
  socketClose: undefined;
  socketError: Event;
};

export type RemoteFunctionRun = (
  ...args: string[]
) => string[] | Promise<string[]>;

export type RemoteFunction = RemoteCommand & {
  run: RemoteFunctionRun;
};
