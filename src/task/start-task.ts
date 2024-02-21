import { connectSocket } from "../connect-socket";
import { ServerEvents, serverEvents } from "../common";
import { type Task } from "./task";

export async function startTask(
  this: Task,
  events: (keyof ServerEvents)[] = [...serverEvents]
): Promise<void> {
  const response = await this.fetch(this.config.baseUrl + "/api/runs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: this.authorization,
    },
    body: JSON.stringify({
      prompt: this.prompt,
      step: this.stepByStep,
      secret: this.config.engineSecret,
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();

  if (!data.url) {
    throw new Error("Failed to start task: " + data.error);
  }

  this.socket = await connectSocket(
    this.WebSocket,
    data.url.replace("http", "ws")
  );

  this.socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    this.emit(data.event, data.data);
  };

  this.socket.onclose = () => this.emit("socketClose", undefined);
  this.socket.onerror = (event) => this.emit("socketError", event);
  this.socket.onmessage = (event) => {
    if (typeof event.data === "string") {
      const { type, ...data } = JSON.parse(event.data);
      this.emit(type, data);
    }
  };

  this.send("hello", {
    events: events,
    secret: this.config.engineSecret,
  });

  await this.wait("ready");
}
