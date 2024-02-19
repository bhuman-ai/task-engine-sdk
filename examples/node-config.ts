import { Config } from "task-engine-sdk";
import WebSocket from "ws";

const { CLIENT_ID, CLIENT_SECRET, ENGINE_SECRET } = process.env as Record<
  string,
  string
>;

export const config: Config = {
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  engineSecret: ENGINE_SECRET,
  WebSocket,
};
