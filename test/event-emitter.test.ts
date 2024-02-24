import { test, jest, expect } from "@jest/globals";

import { EventEmitter } from "task-engine-sdk";

test("Event emitter events should not cross talk", () => {
  const emitter = new EventEmitter();
  const listener = jest.fn();
  const anotherListener = jest.fn();
  emitter.on("test-event", listener);
  emitter.emit("test-event", "data");
  expect(listener).toHaveBeenCalledWith("data");
  expect(anotherListener).not.toHaveBeenCalled();
});

test("Event emitter off should remove a listener", () => {
  const emitter = new EventEmitter();
  const listener = jest.fn();
  emitter.on("test-event", listener);
  emitter.emit("test-event", "data");
  expect(listener).toHaveBeenCalledWith("data");
  emitter.off("test-event", listener);
  emitter.emit("test-event", "data");
  expect(listener).toHaveBeenCalledTimes(1);
});

test("Event emitter once should only call the listener once", () => {
  const emitter = new EventEmitter();
  const listener = jest.fn();
  emitter.once("test-event", listener);
  emitter.emit("test-event", "data");
  expect(listener).toHaveBeenCalledWith("data");
  emitter.emit("test-event", "data");
  expect(listener).toHaveBeenCalledTimes(1);
});

test("Event emitter tap should tap into all events", () => {
  const emitter = new EventEmitter();
  const tap = jest.fn();
  emitter.tap(tap);
  emitter.emit("test-event", "data");
  expect(tap).toHaveBeenCalledWith("test-event", "data");
});

test("Event emitter untap should untap from all events", () => {
  const emitter = new EventEmitter();
  const tap = jest.fn();
  emitter.tap(tap);
  emitter.untap(tap);
  emitter.emit("test-event", "data");
  expect(tap).not.toHaveBeenCalled();
});

test("Event emitter calls all listeners for an event", () => {
  const emitter = new EventEmitter();
  const listener = jest.fn();
  const anotherListener = jest.fn();
  emitter.on("test-event", listener);
  emitter.on("test-event", anotherListener);
  emitter.emit("test-event", "data");
  expect(listener).toHaveBeenCalledWith("data");
  expect(anotherListener).toHaveBeenCalledWith("data");
});

test("Event emitter wait should wait for an event to be emitted", async () => {
  const emitter = new EventEmitter();
  const promise = emitter.wait("test-event");
  emitter.emit("test-event", "data");
  const data = await promise;
  expect(data).toBe("data");
});
