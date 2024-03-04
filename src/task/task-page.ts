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

  /**
   * Type text into the page
   */
  public async type(text: string, delay = 0) {
    this.task.send("type", {
      page: this.name,
      text,
      delay,
    });
    await this.task.wait("typeCompleted");
  }

  /**
   * Type into an element with a selector
   */
  public async typeInto(selector: string, text: string, delay = 0) {
    await this.focus(selector);
    await this.type(text, delay);
  }

  private async opByText(
    text: string,
    op: "click" | "scrollIntoView",
    xOffset = 0,
    yOffset = 0
  ) {
    this.task.send("opByText", {
      page: this.name,
      text,
      op,
      xOffset,
      yOffset,
    });
    await this.task.wait("opByTextCompleted");
  }

  /**
   * Click on an element with the given text
   */
  public async clickByText(text: string, xOffset = 0, yOffset = 0) {
    await this.opByText(text, "click", xOffset, yOffset);
  }

  /**
   * Scroll an element with the given text into view
   */

  public async scrollTextIntoView(text: string, xOffset = 0, yOffset = 0) {
    await this.opByText(text, "scrollIntoView", xOffset, yOffset);
  }

  /**
   * Focus an element with the given text
   */
  public async focus(selector: string) {
    await this.evaluate((selector) => {
      document.querySelector<HTMLInputElement>(selector)?.focus();
    }, selector);
  }

  /**
   * Click on an element with the given selector
   */
  public async click(selector: string) {
    await this.evaluate((selector) => {
      document.querySelector<HTMLButtonElement>(selector)?.click();
    }, selector);
  }
}
