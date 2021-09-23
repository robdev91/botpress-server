const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
const { Connection } = require("./monitor");

describe("services/monitor", () => {
  let io, clientSocket, connection, httpServer;

  beforeAll((done) => {
    httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      done()
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test("connect, send events", (done) => {
    io.on('connection', (socket) => {
      connection = new Connection(io, socket, ['.']);
    });
    clientSocket.on("watchers", (arg) => {
      expect(arg.length).toBe(1);
      expect(arg[0].id).toBe(0);
      expect(arg[0].isDirectory).toBe(true);
      connection.disconnect();
      done();
    });
  });
});