import { EventEmitter } from "../event-emitter";
import { ClientEvents, ServerEvents } from "../types";
import { startTask } from "./start-task";
import { TaskPage } from "./task-page";
import { Config, RemoteFunction, RemoteFunctionRun, TaskEvents } from "./types";

const DEFAULT_BASE_URL = "https://auto-spawner.bhumanai.workers.dev";

export class Task extends EventEmitter<TaskEvents> {
  public config: Config;
  public socket!: WebSocket;
  public fetch: typeof fetch;
  public WebSocket: typeof WebSocket;
  public authorization!: string;
  public prompt: string;
  public stepByStep: boolean;

  private remoteCommands: Record<string, RemoteFunctionRun> = {};

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

  public page(name: string) {
    return new TaskPage(this, name);
  }

  public async start(events?: (keyof ServerEvents)[]) {
    await startTask(this, events);

    this.on("remoteCommandRequest", async ({ name, args }) => {
      const run = this.remoteCommands[name];

      if (!run) return;

      this.send("remoteCommandResponse", {
        name,
        response: await run(...args),
      });
    });
  }

  public addFunction({ run, ...spec }: RemoteFunction) {
    this.send("addCommands", {
      remoteCommands: [spec],
      apiCommands: [],
    });

    this.remoteCommands[spec.name] = run;
  }

  public removeFunction(name: string) {
    this.send("removeCommands", { names: [name] });
    delete this.remoteCommands[name];
  }
}
