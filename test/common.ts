import { Config } from "task-engine-sdk";
import WebSocket from "ws";

export const SECONDS = 1000;
export const MINUTES = 60 * SECONDS;

const { CLIENT_ID, CLIENT_SECRET, ENGINE_SECRET } = process.env as Record<
  string,
  string
>;

if (!CLIENT_ID || !CLIENT_SECRET || !ENGINE_SECRET) {
  throw new Error("CLIENT_ID, CLIENT_SECRET, and ENGINE_SECRET are required");
}

export const config: Config = {
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  engineSecret: ENGINE_SECRET,
  WebSocket,
};
