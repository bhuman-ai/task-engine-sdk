import { Task } from "task-engine-sdk";
import { config } from "./node-config";

const task = new Task(config, "What is 123 * 123?");

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
  await task.start();

  task.addFunction({
    name: "acme_login",
    args: ["page"],
    description: "Login to ACME",
    run: async (pageId: string) => {
      const page = task.page(pageId);
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

  const answer = await task.waitDone();

  console.log(answer);
  process.exit();
}

main();
