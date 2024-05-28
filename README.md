# Task Engine SDK

Manage and extend BHuman's Task Engine with JavaScript or TypeScript.

The type documentation can be found [here](https://bhuman-ai.github.io/task-engine-sdk/).

## Installation

```bash
npm i task-engine-sdk
```

> You may also need to install `fetch` and `ws` depending on your environment.

## Getting Started

### Step 1: Define the configuration

```ts
import { Config } from "task-engine-sdk";

export const config: Config = {
  clientId: "CLIENT_ID",
  clientSecret: "CLIENT_SECRET",
  engineSecret: "ENGINE_SECRET",
};
```

<details>
<summary>
    Adding fetch and WebSocket if not globally defined.
</summary>

```ts
import { Config } from "task-engine-sdk";
import fetch from "node-fetch";
import WebSocket from "ws";

export const config: Config = {
  clientId: "CLIENT_ID",
  clientSecret: "CLIENT_SECRET",
  engineSecret: "ENGINE_SECRET",
  fetch,
  WebSocket,
};
```

</details>

### Step 2: Create a task

```ts
import { Task } from "task-engine-sdk";

const task = new Task(config, "What time is it in NYC?");
```

### Step 3: Run the task

```ts
const result = await task.run(); // It is 12:00 PM in NYC.
```

## Advanced Usage

### Adding a custom function

```ts
import { FunctionsPlugin } from "task-engine-sdk";
// create the task...
const functions = new FunctionsPlugin();
task.use(functions);
functions.add({
  name: "multiply",
  args: ["number a", "number b"],
  description: "Multiply two numbers together",
  run: (a: string, b: string) => [`Answer: ${+a * +b}`],
});
// run the task...
```

Please refer to the [examples](https://github.com/bhuman-ai/task-engine-sdk/tree/main/examples) directory for more.

- `examples/add-function.ts`: To add a custom function.
- `examples/open-page.ts`: To open a page in the browser.
- `examples/page-evaluate.ts`: To run a script in the browser.
