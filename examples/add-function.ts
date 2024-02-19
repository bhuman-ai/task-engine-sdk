import { Task } from "task-engine-sdk";
import { config } from "./node-config";

const task = new Task(config, "What is 123 * 123?");

async function main() {
  await task.start();

  task.addFunction({
    name: "multiply",
    args: ["number a", "number b"],
    description: "Multiply two numbers together",
    run: (a: string, b: string) => [`Answer: ${+a * +b}`],
  });

  const answer = await task.waitDone();

  console.log(answer); // The result of multiplying 123 by 123 is 15129.
  process.exit();
}

main();
