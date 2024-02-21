import { RemoteCommand, ServerEvents } from "./common";

/**
 * Configuration for the task
 *
 * The same configuration can be used for all tasks
 *
 * The client ID and client secret can be obtained from the API Keys tab in the settings.
 *
 * The engine secret can be any arbitrary string, however to use the same browser session across multiple tasks, the same engine secret must be used.
 * 
 * If WebSocket is not globally defined, it must be provided in the config. The same applies to fetch.
 */
export type Config = {
  clientId: string;
  clientSecret: string;
  engineSecret: string;

  authorization?: string;
  baseUrl?: string;
  fetch?: any;
  WebSocket?: any;
};

/**
 * All events that can be emitted by a Task
 */
export type TaskEvents = ServerEvents & {
  socketClose: undefined;
  socketError: Event;
};

/**
 * A remote function that can be called by the Task Agent.
 */
export type RemoteFunctionRun = (
  ...args: string[]
) => string[] | Promise<string[]>;

/**
 * A remote function definition that can be called by the Task Agent.
 */
export type RemoteFunction = RemoteCommand & {
  run: RemoteFunctionRun;
};

