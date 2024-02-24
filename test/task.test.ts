import { expect, test } from "@jest/globals";

import {
  Config,
  Task,
  FETCH_UNDEFINED_ERROR,
  WEBSOCKET_UNDEFINED_ERROR,
} from "task-engine-sdk";

export const config: Config = {
  clientId: "CLIENT_ID123",
  clientSecret: "CLIENT_SECRET123",
  engineSecret: "ENGINE_SECRET123",
};

test("Task without fetch should throw an error", () => {
  const fetch = globalThis.fetch;
  (globalThis.fetch as any) = undefined;

  expect(() => {
    new Task(config, "What time is it in New York?");
  }).toThrow(FETCH_UNDEFINED_ERROR);

  globalThis.fetch = fetch;
});

test("Task without WebSocket should throw an error", () => {
  expect(() => {
    new Task(config, "What time is it in New York?");
  }).toThrow(WEBSOCKET_UNDEFINED_ERROR);
});

test("Task should set correct authorization header", () => {
  class ExposedTask extends Task {
    public getAuthorization() {
      return this.authorization;
    }
  }

  globalThis.WebSocket = true as any;

  const task = new ExposedTask(config, "What time is it in New York?");
  expect(task.getAuthorization()).toEqual(
    "Basic Q0xJRU5UX0lEMTIzOkNMSUVOVF9TRUNSRVQxMjM="
  );
});
