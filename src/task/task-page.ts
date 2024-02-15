import { KeyInput, MouseButton } from "../common";
import { Task } from "./task";

export class TaskPage {
  constructor(private task: Task, public name: string) {}

  public keyup(key: KeyInput) {
    this.task.send("keyboard", {
      page: this.name,
      action: "up",
      key,
    });
  }

  public keydown(key: KeyInput) {
    this.task.send("keyboard", {
      page: this.name,
      action: "down",
      key,
    });
  }

  public keypress(key: KeyInput) {
    this.task.send("keyboard", {
      page: this.name,
      action: "press",
      key,
    });
  }

  public mouseup(button: MouseButton) {
    this.task.send("mouseButton", {
      page: this.name,
      action: "up",
      button,
    });
  }

  public mousedown(button: MouseButton) {
    this.task.send("mouseButton", {
      page: this.name,
      action: "down",
      button,
    });
  }

  public mousemove(x: number, y: number) {
    this.task.send("mouseMove", {
      page: this.name,
      x,
      y,
    });
  }

  public mousewheel(deltaX: number, deltaY: number) {
    this.task.send("mouseWheel", {
      page: this.name,
      deltaX,
      deltaY,
    });
  }

  public close() {
    this.task.send("closePage", {
      page: this.name,
    });
  }

  public evaluate(code: string | Function) {
    if (typeof code === "function") {
      code = `(${code})()`;
    }

    this.task.send("evaluateRequest", {
      page: this.name,
      code,
    });
    return this.task.wait("evaluateResponse");
  }

  public screenshot() {
    this.task.send("screenshotRequest", {
      page: this.name,
    });
    return this.task.wait("screenshotResponse");
  }
}
