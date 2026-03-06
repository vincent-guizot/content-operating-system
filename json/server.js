const jsonServer = require("json-server");

const server = jsonServer.create();

const router = jsonServer.router(__dirname + "/data.json");

const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use("/api", router);

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`JSON Server running on http://localhost:${PORT}/api`);
});
