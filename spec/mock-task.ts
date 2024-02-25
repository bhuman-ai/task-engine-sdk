import { jest } from "@jest/globals";
import { Config, Task } from "task-engine-sdk";
import WebSocket from "ws";

export const configWithoutWS: Config = {
  clientId: "CLIENT_ID123",
  clientSecret: "CLIENT_SECRET123",
  engineSecret: "ENGINE_SECRET123",
};

export const config: Config = {
  ...configWithoutWS,
  WebSocket,
};

export class MockTask extends Task {
  send: jest.Mock = jest.fn();

  public getAuthorization() {
    return this.authorization;
  }

  public getWebSocket() {
    return this.WebSocket;
  }

  public getFetch() {
    return this.fetch;
  }

  public emitReady() {
    this.emit("ready", {
      prompt: this.prompt,
      pages: [],
    });
  }
}
