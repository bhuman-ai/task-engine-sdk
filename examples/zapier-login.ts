import { FunctionsPlugin, Task } from "task-engine-sdk";
import { config } from "./node-config";

const task = new Task(config, "Login to Zapier");
const functions = new FunctionsPlugin();

const { ZAPIER_EMAIL, ZAPIER_PASSWORD } = process.env as Record<string, string>;

task.use(functions);

functions.add({
  name: "open_zapier",
  args: [],
  description: "Open Zapier, use this quickly open the Zapier App instead of manually loging in!",
  run: async () => {
    const page = await task.openPage(
      "Zapier App",
      "https://zapier.com/app/login"
    );

    await page.typeInto("#login-email", ZAPIER_EMAIL);
    await page.click("#login-submit");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await page.typeInto("#login-password", ZAPIER_PASSWORD);
    await page.click("#login-submit");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      "Logged in successfully into Zapier, here is a screenshot:",
      await page.screenshot(),
    ];
  },
});

async function main() {
  const answer = await task.run();
  console.log(answer);
  process.exit();
}

main();
