

export async function connectSocket(
  WS: typeof WebSocket,
  url: string,
  maxRetries: number,
  retryTimeout: number
) {
  return new Promise<WebSocket>((resolve, reject) => {
    let retries = 0;
    const run = () => {
      const socket = new WS(url);

      let closed = false;

      function onClose() {
        if (closed) {
          return;
        }
        closed = true;

        if (retries >= maxRetries) {
          reject(
            new Error(
              "Failed to connect to task execution server after " +
                retries +
                " retries"
            )
          );
        } else {
          retries++;
          setTimeout(run, retryTimeout);
        }
      }

      socket.addEventListener("open", () => {
        socket.removeEventListener("close", onClose);
        resolve(socket);
      });

      socket.addEventListener("close", onClose);
      socket.addEventListener("error", onClose);
    };

    run();
  });
}
