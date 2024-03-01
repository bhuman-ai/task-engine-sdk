import { Config } from "task-engine-sdk";
import WebSocket from "ws";
import "dotenv/config";

const { CLIENT_ID, CLIENT_SECRET, ENGINE_SECRET, BASE_URL } =
  process.env as Record<string, string>;

export const config: Config = {
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  engineSecret: ENGINE_SECRET,
  baseUrl: BASE_URL, // remove this line for the default value
  WebSocket,
};
