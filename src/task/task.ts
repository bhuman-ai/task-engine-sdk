import { ClientEvents, EventEmitter, ServerEvents } from "../common";
import { Config, TaskEvents } from "../types";
import { startTask } from "./start-task";
import { TaskPage } from "./task-page";

export interface TaskPlugin {
  setupFor(task: Task): void;
}

const DEFAULT_BASE_URL = "https://auto-spawner.bhumanai.workers.dev";

/**
 * Task that can be run in the Task Agent
 */
export class Task extends EventEmitter<TaskEvents> {
  protected config: Config;
  protected socket!: WebSocket;
  protected fetch: typeof fetch;
  protected WebSocket: typeof WebSocket;
  protected authorization!: string;
  protected prompt: string;
  protected stepByStep: boolean;

  /**
   * @param config The configuration for the task
   * @param prompt The prompt to run, e.g. "What time is it in New York?"
   * @param stepByStep Should the task be run step by step. Every step must be confirmed by the user by sending a resume event.
   */
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

  /**
   * Send an event to the Task Agent
   * @param type What type of event to send
   * @param data The data to send
   */
  public send<T extends keyof ClientEvents>(type: T, data: ClientEvents[T]) {
    this.socket.send(JSON.stringify({ type, ...data }));
  }

  /**
   * Get a page in the browser
   * @param name The name of the page
   */
  public page(name: string) {
    return new TaskPage(this, name);
  }

  /**
   * Start the task
   * @param events The events to listen for, defaults to listening to all events
   */
  public async start(events?: (keyof ServerEvents)[]) {
    await startTask.bind(this)(events);
  }

  public async run() {
    await this.start();
    return await this.waitDone();
  }

  /**
   * Exit the task, this will force the task to stop
   */
  public async exit() {
    this.send("exit", {});
  }

  /**
   * Use a plugin for the task
   * @param plugin The plugin to use
   */
  public use(plugin: TaskPlugin) {
    plugin.setupFor(this);
  }

  /**
   * Wait for the task to be done
   * @returns The result of the task, e.g. The answer to the prompt.
   */
  public async waitDone() {
    while (true) {
      const event = await this.wait("command");
      if (event.name === "done") {
        return event.args[0] as string;
      }
    }
  }
}
