import { RemoteCommand, ServerEvents } from "../common";

export type Config = {
  clientId: string;
  clientSecret: string;
  engineSecret: string;

  authorization?: string;
  baseUrl?: string;
  fetch?: any;
  WebSocket?: any;
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
