import { connectSocket } from "../connect-socket";
import { ServerEvents, serverEvents } from "../common";
import { type Task } from "./task";

const MAX_RETRIES = 50;
const RETRY_TIMEOUT = 2000;

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
    data.url.replace("http", "ws"),
    MAX_RETRIES,
    RETRY_TIMEOUT
  );

  this.socket.addEventListener("close", () => {
    this.emit("socketClose", undefined);
  });
  this.socket.addEventListener("error", (event) => {
    this.emit("socketError", event);
  });
  this.socket.addEventListener("message", (event) => {
    if (typeof event.data === "string") {
      const { type, ...data } = JSON.parse(event.data);
      this.emit(type, data);
    } else if (event.data instanceof Blob) {
      this.emit("capture", event.data);
    }
  });

  this.send("hello", {
    events: events,
    secret: this.config.engineSecret,
  });

  await this.wait("ready");
}
