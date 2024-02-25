import { expect, test, jest } from "@jest/globals";
import { WebSocket, WebSocketServer } from "ws";
import { connectSocket } from "../src/connect-socket";

test("connectSocket should retry the right amount of times", async () => {
  const url = "ws://localhost:1234";

  const WS = jest.fn(() => new WebSocket(url));

  async function connect() {
    await connectSocket(WS as any, url, 3, 100);
  }
  await expect(connect).rejects.toThrow(
    "Failed to connect to task execution server after 3 retries"
  );

  expect(WS).toHaveBeenCalledTimes(4);
});

test("connectSocket should resolve when it connects", async () => {
  const url = "ws://localhost:4321";

  const server = new WebSocketServer({ port: 4321 });

  server.on("connection", (socket) => {
    socket.close();
  });

  const WS = jest.fn(() => new WebSocket(url));

  const socket = await connectSocket(WS as any, url, 3, 100);

  expect(socket).toBeInstanceOf(WebSocket);

  server.close();
});
