# Task Engine SDK

Create, manage and extend BHuman's Task Engine with JavaScript or TypeScript.

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

### Step 3: Start it and wait until it is done

```ts
await task.start();
const result = await task.waitDone(); // It is 12:00 PM in NYC.
```

### Advanced Usage

Please refer to the examples for more advanced usage.
