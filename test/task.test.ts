import { expect, test } from "@jest/globals";
import { Config, Task } from "task-engine-sdk";
import WebSocket from "ws";
import { MINUTES, config } from "./common";

const invalidConfig: Config = {
  clientId: "CLIENT_ID123",
  clientSecret: "CLIENT_SECRET123",
  engineSecret: "ENGINE_SECRET123",
  WebSocket,
};

test("Task with invalid credentials should throw Unauthorized", async () => {
  const task = new Task(invalidConfig, "What is 1 + 1?");

  await expect(async () => {
    await task.run();
  }).rejects.toThrow("Unauthorized");
});

test(
  "Task with valid credentials should work",
  async () => {
    const task = new Task(config, "What is 1 + 1?");

    const answer = await task.run();

    expect(answer).toContain("2");
  },
  2 * MINUTES
);
