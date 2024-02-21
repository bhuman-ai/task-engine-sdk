import { KeyInput, MouseButton } from "../common";
import { Task } from "./task";

/**
 * A page in the browser of the Task Agent
 */
export class TaskPage {
  constructor(private task: Task, public name: string) {}

  /**
   * Send a keyup event to the page
   */
  public keyup(key: KeyInput) {
    this.task.send("keyboard", {
      page: this.name,
      action: "up",
      key,
    });
  }

  /**
   * Send a keydown event to the page
   */
  public keydown(key: KeyInput) {
    this.task.send("keyboard", {
      page: this.name,
      action: "down",
      key,
    });
  }

  /**
   * Send a keypress event to the page
   */
  public keypress(key: KeyInput) {
    this.task.send("keyboard", {
      page: this.name,
      action: "press",
      key,
    });
  }

  /**
   * Send a mouseup event to the page
   */
  public mouseup(button: MouseButton) {
    this.task.send("mouseButton", {
      page: this.name,
      action: "up",
      button,
    });
  }

  /**
   * Send a mousedown event to the page
   */
  public mousedown(button: MouseButton) {
    this.task.send("mouseButton", {
      page: this.name,
      action: "down",
      button,
    });
  }

  /**
   * Send a mousemove event to the page
   */
  public mousemove(x: number, y: number) {
    this.task.send("mouseMove", {
      page: this.name,
      x,
      y,
    });
  }

  /**
   * Send a mousewheel event to the page
   */
  public mousewheel(deltaX: number, deltaY: number) {
    this.task.send("mouseWheel", {
      page: this.name,
      deltaX,
      deltaY,
    });
  }

  /**
   * Close the page, this should generally not be used.
   */
  public close() {
    this.task.send("closePage", {
      page: this.name,
    });
  }

  /**
   * Run a function in the page
   * 
   * Note: the function will be serialized and sent to the page. This means that it cannot reference any variables outside of its scope.
   */
  public async evaluate<T = unknown, A extends unknown[] = []>(
    fn: (...args: A) => T,
    ...args: A
  ) {
    this.task.send("evaluateRequest", {
      page: this.name,
      code: `(${fn})(...${JSON.stringify(args)})`,
    });
    const out = await this.task.wait("evaluateResponse");
    return out["result"] as T;
  }

  /**
   * Take a screenshot of the page
   */
  public async screenshot() {
    this.task.send("screenshotRequest", {
      page: this.name,
    });
    const { data } = await this.task.wait("screenshotResponse");
    return data;
  }
}
