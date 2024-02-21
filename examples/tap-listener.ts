import { Task } from "task-engine-sdk";
import { config } from "./node-config";

const task = new Task(config, "What is 1 + 1?");

function tapFn(eventName: string, data: any) {
  console.log(eventName, data);
}

task.tap(tapFn); // add a tap listener function

async function main() {
  const answer = await task.run();
  task.untap(tapFn); // remove the tap listener function
  console.log(answer); // The solution to the addition problem 1 + 1 is 2.
  process.exit();
}

main();
