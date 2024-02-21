import { Task } from "task-engine-sdk";
import { config } from "./node-config";
import { VariablesPlugin } from "../src/plugins";

const task = new Task(config, "What is my last email on Gmail?");

const vars = new VariablesPlugin();
task.use(vars);

vars.add({
  page: /gmail/i,
  name: /username|email/i,
  value: "john.doe@gmail.com",
});

vars.add({
  page: /gmail/i,
  name: /password/i,
  value: "password123",
});

async function main() {
  await task.start();
  const answer = await task.waitDone();
  console.log(answer);
  process.exit();
}

main();
