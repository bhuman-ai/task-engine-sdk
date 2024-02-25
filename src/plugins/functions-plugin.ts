import { Task, TaskPlugin } from "../task";
import { RemoteFunction, RemoteFunctionRun } from "../types";

export class FunctionsPlugin implements TaskPlugin {
  protected remoteFunctionRuns: Record<string, RemoteFunctionRun> = {};
  protected addList: RemoteFunction[] = [];
  protected addedNames: Map<Task, string[]> = new Map();
  protected readyTasks: Task[] = [];

  public setupFor(task: Task) {
    task.once("ready", () => {
      this.init(task);
    });
  }

  protected init(task: Task) {
    task.on("remoteCommandRequest", async ({ name, args }) => {
      const run = this.remoteFunctionRuns[name];

      if (!run) return;

      task.send("remoteCommandResponse", {
        name,
        response: await run(...args),
      });
    });

    for (const remoteFunction of this.addList) {
      this.addForTask(task, remoteFunction);
    }

    this.readyTasks.push(task);
  }

  /**
   * Add a function that can be called by the Task Agent
   * @param remoteFunction The definition of the function to add
   */
  public add(remoteFunction: RemoteFunction) {
    this.addList.push(remoteFunction);
    this.remoteFunctionRuns[remoteFunction.name] = remoteFunction.run;
    for (const task of this.readyTasks) {
      this.addForTask(task, remoteFunction);
    }
  }

  protected addForTask(task: Task, remoteFunction: RemoteFunction) {
    const { run, ...spec } = remoteFunction;
    task.send("addCommands", {
      remoteCommands: [spec],
      apiCommands: [],
    });
    this.addedNames.set(
      task,
      (this.addedNames.get(task) ?? []).concat(remoteFunction.name)
    );
  }

  /**
   * Remove a function that can be called by the Task Agent
   * @param names The names of the functions to remove
   */
  public remove(...names: string[]) {
    this.addList = this.addList.filter((fn) => !names.includes(fn.name));
    for (const name of names) {
      delete this.remoteFunctionRuns[name];
    }
    for (const task of this.readyTasks) {
      this.removeForTask(task, ...names);
    }
  }

  protected removeForTask(task: Task, ...names: string[]) {
    const addedNames = this.addedNames.get(task)!;
    const namesToRemove = names.filter((name) => addedNames.includes(name));
    const namesToKeep = addedNames.filter((name) => !names.includes(name));
    task.send("removeCommands", { names: namesToRemove });
    this.addedNames.set(task, namesToKeep);
  }
}
