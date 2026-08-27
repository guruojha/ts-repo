# Codespace Task API

This is a small project for learning three connected ideas:

- **GitHub Codespaces:** a cloud development environment with a terminal, editor, and forwarded ports.
- **TypeScript:** JavaScript with types, compiled into JavaScript before production use.
- **Docker:** a repeatable package containing the app and its runtime.

## 1. Start in the Codespace

Open the integrated terminal and run:

```bash
npm install
npm run dev
```

Codespaces should notice that port `3000` is listening. Open the **Ports** panel, then open the forwarded address in a browser.

Try these requests in a second terminal:

```bash
curl http://localhost:3000/
curl http://localhost:3000/tasks
curl -X POST http://localhost:3000/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Make a change in TypeScript"}'
```

The dev server watches `src/server.ts`, so edit a task title, save, and repeat the `GET /tasks` request.

## 2. Read the TypeScript

Start with [src/types.ts](src/types.ts). `Task` describes the shape of data, and `NewTask` reuses part of that shape with `Pick`.

Then inspect [src/server.ts](src/server.ts):

1. `sendJson` has typed parameters and accepts any response body.
2. `readBody` is asynchronous because HTTP request data arrives in chunks.
3. `handleRequest` branches on the HTTP method and URL path.
4. `const task: Task` asks TypeScript to check that the new object has the right fields.

Run the compiler without starting the server:

```bash
npm run build
```

Try changing `done: false` to `done: "no"` and run the build again. TypeScript should explain the mismatch. Change it back afterward.

## 3. Build and run with Docker

The Dockerfile uses two stages: the first compiles TypeScript, and the smaller final stage runs only the compiled app and production dependencies.

```bash
docker build -t codespace-task-api .
docker run --rm -p 3000:3000 codespace-task-api
```

In another terminal, call the containerized app:

```bash
curl http://localhost:3000/tasks
```

The `-p 3000:3000` flag maps your computer's port to the container's port. Stop the container with `Ctrl+C`.

## 4. GitHub practice

Use the Source Control view or these commands to see the Codespaces Git workflow:

```bash
git status
git add .
git commit -m "Create TypeScript task API"
git log --oneline -1
```

Do not commit `node_modules` or `dist`; `.gitignore` keeps those generated directories out of Git.

## Next experiments

- Add `PATCH /tasks/:id` to mark a task complete.
- Return a `404` when a requested task ID does not exist.
- Add a test runner such as Vitest.
- Add a `.devcontainer/devcontainer.json` so a new Codespace installs dependencies automatically.
- Replace the in-memory array with SQLite or PostgreSQL once the HTTP and TypeScript basics feel comfortable.