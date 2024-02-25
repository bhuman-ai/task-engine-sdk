import { expect, test } from "@jest/globals";
import {
  FETCH_UNDEFINED_ERROR,
  Task,
  WEBSOCKET_UNDEFINED_ERROR,
} from "task-engine-sdk";
import WebSocket from "ws";
import { MockTask, config, configWithoutWS } from "./mock-task";

test("Task without fetch should throw an error", () => {
  const fetch = globalThis.fetch;
  (globalThis.fetch as any) = undefined;

  expect(() => {
    new Task(configWithoutWS, "What time is it in New York?");
  }).toThrow(FETCH_UNDEFINED_ERROR);

  globalThis.fetch = fetch;
});

test("Task without WebSocket should throw an error", () => {
  expect(() => {
    new Task(configWithoutWS, "What time is it in New York?");
  }).toThrow(WEBSOCKET_UNDEFINED_ERROR);
});

test("Task should use custom WebSocket", () => {
  globalThis.WebSocket = class AnotherWebSocket extends WebSocket {} as any;
  const task = new MockTask(config, "What time is it in New York?");
  expect(task.getWebSocket()).toEqual(config.WebSocket);
});

test("Task should use custom fetch", () => {
  const fetch = (...args: Parameters<typeof globalThis.fetch>) =>
    globalThis.fetch(...args);
  const task = new MockTask(
    { fetch, ...config },
    "What time is it in New York?"
  );
  expect(task.getFetch()).toEqual(fetch);
});

test("Task should set correct authorization header", () => {
  const task = new MockTask(config, "What time is it in New York?");
  expect(task.getAuthorization()).toEqual(
    "Basic Q0xJRU5UX0lEMTIzOkNMSUVOVF9TRUNSRVQxMjM="
  );
});

test("Task should set custom authorization header", () => {
  const authorization = "Bearer TOKEN";

  const task = new MockTask(
    {
      ...config,
      authorization,
    },
    "What time is it in New York?"
  );
  expect(task.getAuthorization()).toEqual(authorization);
});
