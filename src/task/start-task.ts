import { connectSocket } from "../connect-socket";
import { ServerEvents, serverEvents } from "../common";
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

  if (!data.url) {
    throw new Error("Failed to start task: " + data.error);
  }

  task.socket = await connectSocket(
    task.WebSocket,
    data.url.replace("http", "ws")
  );

  task.socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    task.emit(data.event, data.data);
  };

  task.socket.onclose = () => task.emit("socketClose", undefined);
  task.socket.onerror = (event) => task.emit("socketError", event);
  task.socket.onmessage = (event) => {
    if (typeof event.data === "string") {
      const { type, ...data } = JSON.parse(event.data);
      task.emit(type, data);
    }
  };

  task.send("hello", {
    events: events,
    secret: task.config.engineSecret,
  });

  await task.wait("ready");
}
