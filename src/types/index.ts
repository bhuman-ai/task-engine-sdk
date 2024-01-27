import { ClientEvents } from "./client-events";
import { ServerEvents } from "./server-events";

export type Events = ServerEvents & ClientEvents;

export * from "./base";
export * from "./client-events";
export * from "./commands";
export * from "./key-inputs";
export * from "./server-events";
export * from "./message";
