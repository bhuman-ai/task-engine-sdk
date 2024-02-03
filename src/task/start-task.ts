import { connectSocket } from "../connect-socket";
import { ServerEvents, serverEvents } from "../types";
import { type Task } from "./task";

export async function startTask(
  task: Task,
  events: (keyof ServerEvents)[] = [...serverEvents]
): Promise<void> {
  const response = await task.fetch(task.config.baseUrl + "/api/runs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: task.authorization,
    },
    body: JSON.stringify({
      prompt: task.prompt,
      step: task.stepByStep,
      secret: task.config.engineSecret,
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();

  console.log("Started task", data);

  if (!data.url) {
    throw new Error("Failed to start task: " + data.error);
  }

  console.log("Connecting to task execution server");

  task.socket = await connectSocket(
    task.WebSocket,
    data.url.replace("http", "ws")
  );

  console.log("Connected to task execution server");

  task.socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    task.emit(data.event, data.data);
  };

  task.socket.onclose = () => task.emit("socketClose", undefined);
  task.socket.onerror = (event) => task.emit("socketError", event);
  task.socket.onmessage = (event) => {
    console.log("onmessage", typeof event.data);
    if (typeof event.data === "string") {
      const { type, ...data } = JSON.parse(event.data);
      task.emit(type, data);
    } else {
      console.log(event.data);
    }
  };

  task.send("hello", {
    events,
    secret: task.config.engineSecret,
  });
}
