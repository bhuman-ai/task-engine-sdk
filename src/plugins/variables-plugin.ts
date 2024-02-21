import { type Task, TaskPlugin } from "../task";

export type VariableEntry = {
  name: RegExp;
  page?: RegExp;
  value: string;
};

export class VariablesPlugin implements TaskPlugin {
  private entries: VariableEntry[] = [];

  public setupFor(task: Task) {
    task.once("ready", () => {
      this.init(task);
    });
  }

  private init(task: Task) {
    task.on("getVariable", ({ name, page }) => {
      const entry = this.entries.find((entry) => {
        if (entry.page && !page) return false;
        if (entry.page && page && !entry.page.test(page)) return false;
        return entry.name.test(name);
      });

      if (entry) {
        task.send("setVariable", {
          name,
          value: entry.value,
        });
      }
    });
  }

  public add(entry: VariableEntry) {
    this.entries.push(entry);
  }

  public remove(entry: VariableEntry) {
    this.entries = this.entries.filter((e) => e !== entry);
  }
}
