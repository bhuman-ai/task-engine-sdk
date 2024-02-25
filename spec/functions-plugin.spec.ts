import { expect, jest, test } from "@jest/globals";

import { MockTask, config } from "./mock-task";
import { FunctionsPlugin } from "../src/plugins";

class MockFunctionsPlugin extends FunctionsPlugin {
  public getAddList() {
    return this.addList;
  }
  public getAddedNames() {
    return this.addedNames;
  }
  public getReadyTasks() {
    return this.readyTasks;
  }
  public getRemoteFunctionRuns() {
    return this.remoteFunctionRuns;
  }
}

test("Functions should add and remove properly before the task is ready", () => {
  const functions = new MockFunctionsPlugin();
  const task1 = new MockTask(config, "Task 1");
  const task2 = new MockTask(config, "Task 2");
  const task3 = new MockTask(config, "Task 3");

  task1.use(functions);
  task2.use(functions);
  task3.use(functions);

  const run = () => ["Test"];

  task3.emitReady();

  functions.add({
    name: "test",
    args: [],
    description: "Test function",
    run,
  });

  expect(task3.send).toHaveBeenCalledWith("addCommands", {
    remoteCommands: [
      {
        name: "test",
        args: [],
        description: "Test function",
      },
    ],
    apiCommands: [],
  });

  expect(functions.getAddList()).toHaveLength(1);
  expect(functions.getRemoteFunctionRuns()["test"]).toBe(run);

  task1.emitReady();
  expect(task1.send).toHaveBeenCalledTimes(1);

  functions.remove("test");

  expect(task3.send).toHaveBeenLastCalledWith("removeCommands", {
    names: ["test"],
  });

  expect(functions.getAddList()).toHaveLength(0);

  task2.emitReady();

  expect(task1.send).toHaveBeenCalledTimes(2);
  expect(task2.send).not.toHaveBeenCalled();
});

test("Functions should send the result", async () => {
  const functions = new MockFunctionsPlugin();
  const task = new MockTask(config, "Task");
  task.use(functions);

  const run = jest.fn(() => ["Test"]);

  functions.add({
    name: "test",
    args: [],
    description: "Test function",
    run,
  });

  task.emitReady();

  task.emit("remoteCommandRequest", {
    args: [],
    name: "test",
  });

  await new Promise((resolve) => setImmediate(resolve));

  expect(run).toBeCalled();
  expect(task.send).toHaveBeenLastCalledWith("remoteCommandResponse", {
    name: "test",
    response: ["Test"],
  });
});

test("Functions should ignore unknown names", async () => {
  const functions = new MockFunctionsPlugin();
  const task = new MockTask(config, "Task");
  task.use(functions);

  const run = jest.fn(() => ["Test"]);

  functions.add({
    name: "test",
    args: [],
    description: "Test function",
    run,
  });

  task.emitReady();

  task.emit("remoteCommandRequest", {
    args: [],
    name: "unknown",
  });

  await new Promise((resolve) => setImmediate(resolve));

  expect(run).not.toBeCalled();
  expect(task.send).toHaveBeenCalledTimes(1);
});
