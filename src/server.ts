import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import type { NewTask, Task } from "./types.js";

const port = Number(process.env.PORT ?? 3000);
let nextId = 3;
const tasks: Task[] = [
  { id: 1, title: "Explore this Codespace", done: false },
  { id: 2, title: "Run the app in Docker", done: false },
];

function sendJson(response: ServerResponse, statusCode: number, body: unknown): void {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(body));
}

async function readBody(request: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function handleRequest(request: IncomingMessage, response: ServerResponse): Promise<void> {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);

  if (request.method === "GET" && url.pathname === "/") {
    sendJson(response, 200, { message: "Welcome to the Codespace Task API" });
    return;
  }

  if (request.method === "GET" && url.pathname === "/tasks") {
    sendJson(response, 200, tasks);
    return;
  }

  if (request.method === "POST" && url.pathname === "/tasks") {
    try {
      const body = JSON.parse(await readBody(request)) as NewTask;
      if (typeof body.title !== "string" || body.title.trim() === "") {
        sendJson(response, 400, { error: "title must be a non-empty string" });
        return;
      }

      const task: Task = { id: nextId++, title: body.title.trim(), done: false };
      tasks.push(task);
      sendJson(response, 201, task);
    } catch {
      sendJson(response, 400, { error: "body must be valid JSON" });
    }
    return;
  }

  sendJson(response, 404, { error: "route not found" });
}

const server = createServer((request, response) => {
  handleRequest(request, response).catch(() => {
    sendJson(response, 500, { error: "unexpected server error" });
  });
});

server.listen(port, () => {
  console.log(`Task API listening on http://localhost:${port}`);
});