const MAX_RETRIES = 10;
const RETRY_TIMEOUT = 2000;

export async function connectSocket(WS: typeof WebSocket, url: string) {
  console.log("Connecting to task execution server", url);

  return new Promise<WebSocket>((resolve, reject) => {
    let retries = 0;
    const retry = () => {
      console.log("Retrying connection to task execution server");

      retries++;

      const socket = new WS(url);

      socket.onopen = () => {
        socket.onclose = () => {};
        resolve(socket);
      };

      function onStop() {
        if (retries > MAX_RETRIES) {
          reject(new Error("Failed to connect to task execution server"));
        } else {
          setTimeout(retry, RETRY_TIMEOUT);
        }
      }

      socket.onclose = onStop;

      // @ts-ignore - nodejs websocket
      socket.on?.("unexpected-response", onStop);
    };

    retry();
  });
}
