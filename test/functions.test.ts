import { expect, test } from "@jest/globals";
import { Task } from "task-engine-sdk";
import { MINUTES, config } from "./common";

test(
  "Task with valid credentials should work",
  async () => {
    const task = new Task(config, "What is 1 + 1?");

    const answer = await task.run();

    expect(answer).toContain("2");
  },
  2 * MINUTES
);
