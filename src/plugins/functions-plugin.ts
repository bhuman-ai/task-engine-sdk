import { Task, TaskPlugin } from "../task";
import { RemoteFunction, RemoteFunctionRun } from "../types";

export class FunctionsPlugin implements TaskPlugin {
  private remoteFunctionRuns: Record<string, RemoteFunctionRun> = {};
  private addQueue: RemoteFunction[] = [];
  private removeQueue: string[] = [];
  private readyTasks: Task[] = [];

  public setupFor(task: Task) {
    task.once("ready", () => {
      this.init(task);
    });
  }

  private init(task: Task) {
    task.on("remoteCommandRequest", async ({ name, args }) => {
      const run = this.remoteFunctionRuns[name];

      if (!run) return;

      task.send("remoteCommandResponse", {
        name,
        response: await run(...args),
      });
    });

    for (const remoteFunction of this.addQueue) {
      this.addForTask(task, remoteFunction);
    }
    for (const name of this.removeQueue) {
      this.removeForTask(task, name);
    }

    this.readyTasks.push(task);
  }

  /**
   * Add a function that can be called by the Task Agent
   * @param remoteFunction The definition of the function to add
   */
  public add(remoteFunction: RemoteFunction) {
    this.addQueue.push(remoteFunction);
    for (const task of this.readyTasks) {
      this.addForTask(task, remoteFunction);
    }
  }

  private addForTask(task: Task, remoteFunction: RemoteFunction) {
    const { run, ...spec } = remoteFunction;
    task.send("addCommands", {
      remoteCommands: [spec],
      apiCommands: [],
    });

    this.remoteFunctionRuns[spec.name] = run;
  }

  /**
   * Remove a function that can be called by the Task Agent
   * @param names The names of the functions to remove
   */
  public remove(...names: string[]) {
    this.removeQueue.push(...names);
    for (const task of this.readyTasks) {
      this.removeForTask(task, ...names);
    }
  }

  private removeForTask(task: Task, ...names: string[]) {
    task.send("removeCommands", { names });
    for (const name of names) {
      delete this.remoteFunctionRuns[name];
    }
  }
}
