import { Task, FunctionsPlugin } from "task-engine-sdk";
import { config } from "./node-config";

const task = new Task(config, "What is 123 * 123?");
const functions = new FunctionsPlugin();
task.use(functions);

functions.add({
  name: "multiply",
  args: ["number a", "number b"],
  description: "Multiply two numbers together",
  run: (a: string, b: string) => [`Answer: ${+a * +b}`],
});

async function main() {
  const answer = await task.run();
  console.log(answer); // The result of multiplying 123 by 123 is 15129.
  process.exit();
}

main();
