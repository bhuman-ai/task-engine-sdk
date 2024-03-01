import { FunctionsPlugin, Task } from "task-engine-sdk";
import { config } from "./node-config";

const task = new Task(
  config,
  "Search on AirBnB for a trip to Paris during the summer."
);
const functions = new FunctionsPlugin();

task.use(functions);

functions.add({
  name: "airbnb_search",
  args: ["location", "checkin", "checkout"],
  description:
    "Use this to search for a location on airbnb.com. Checkin and checkout are in the format 2024-MM-DD.",
  run: async (location, checkin, checkout) => {
    console.log(
      `Searching for a trip to ${location} from ${checkin} to ${checkout}`
    );

    const url = `https://www.airbnb.com/s/${location}/homes?checkin=${checkin}&checkout=${checkout}`;

    const page = await task.openPage("AirBnB search", url);

    return ["Here is a screenshot of the search:", await page.screenshot()];
  },
});

async function main() {
  const answer = await task.run();
  console.log(answer);
  process.exit();
}

main();
