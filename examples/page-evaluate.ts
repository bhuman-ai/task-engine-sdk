import { FunctionsPlugin, Task } from "task-engine-sdk";
import { config } from "./node-config";

const task = new Task(config, "Login to acme.org.");
const functions = new FunctionsPlugin();

task.use(functions);

functions.add({
  name: "acme_login",
  args: ["page"],
  description: "Login to ACME",
  run: async (pageName: string) => {
    const page = task.page(pageName);
    const ok = await page.evaluate(acmeLoginEval, "admin", "password");
    if (ok) {
      return [
        "Logged in successfully, here is a screenshot:",
        await page.screenshot(),
      ];
    }

    return ["Failed to login"];
  },
});

function acmeLoginEval(username: string, password: string) {
  function getInput(selector: string) {
    return document.querySelector(selector) as HTMLInputElement;
  }

  try {
    getInput("#username").value = username;
    getInput("#password").value = password;
    getInput("#login").click();
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const answer = await task.run();
  console.log(answer);
  process.exit();
}

main();
