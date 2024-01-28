import { connect } from "./connect";
import { EventEmitter } from "./event-emitter";
import { ClientEvents, ServerEvents, serverEvents } from "./types";

const DEFAULT_BASE_URL = "https://auto-spawner.bhumanai.workers.dev";

export interface Config {
  clientId: string;
  clientSecret: string;
  engineSecret: string;

  authorization?: string;
  baseUrl?: string;
  fetch?: typeof fetch;
  WebSocket?: typeof WebSocket;
}

type TaskEvents = ServerEvents & {
  socketClose: () => void;
  socketError: (event: Event) => void;
};

export class Task extends EventEmitter<TaskEvents> {
  private config: Config;
  private socket!: WebSocket;
  private fetch: typeof fetch;
  private WebSocket: typeof WebSocket;
  private authorization!: string;
  public prompt: string;
  public stepByStep: boolean;

  constructor(config: Config, prompt: string, stepByStep = false) {
    super();
    this.config = config;
    this.prompt = prompt;
    this.stepByStep = stepByStep;
    this.config.baseUrl ??= DEFAULT_BASE_URL;

    if (this.config.authorization) {
      this.authorization = this.config.authorization;
    } else {
      const token = btoa(this.config.clientId + ":" + this.config.clientSecret);
      this.authorization = "Basic " + token;
    }

    if (!this.config.fetch && typeof fetch === "undefined") {
      throw new Error(
        "Fetch is not defined globally, please provide a fetch function in the config"
      );
    }

    if (!this.config.WebSocket && typeof WebSocket === "undefined") {
      throw new Error(
        "WebSocket is not defined globally, please provide a WebSocket function in the config"
      );
    }

    this.fetch = this.config.fetch ?? fetch;
    this.WebSocket = this.config.WebSocket ?? WebSocket;
  }

  public send<T extends keyof ClientEvents>(
    type: T,
    data: Omit<Parameters<ClientEvents[T]>[0], "type">
  ) {
    this.socket.send(JSON.stringify({ type, ...data }));
  }

  public async start(
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

    console.log("Started task", data);

    if (!data.url) {
      throw new Error("Failed to start task: " + data.error);
    }

    console.log("Connecting to task execution server");

    this.socket = await connect(this.WebSocket, data.url.replace("http", "ws"));

    console.log("Connected to task execution server");

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.emit(data.event, data.data);
    };

    this.socket.onclose = () => this.emit("socketClose", undefined);
    this.socket.onerror = (event) => this.emit("socketError", event);
    this.socket.onmessage = (event) => {
      console.log("onmessage", typeof event.data);
      if (typeof event.data === "string") {
        const { type, ...data } = JSON.parse(event.data);
        this.emit(type, data);
      } else {
        console.log(event.data);
      }
    };

    this.send("hello", {
      events,
      secret: this.config.engineSecret,
    });
  }
}
