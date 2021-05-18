import http from "http";
import { Server } from "socket.io";

export default class SocketServer {
  #io;
  constructor({ port }) {
    this.port = port;
  }

  //  criando o servidor com a api http do node
  async start() {
    const server = http.createServer((request, response) => {
      response.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
      });

      response.end("hey There!!");
    });

    // criando o cors para o server
    this.#io = new Server(server, {
      cors: {
        origin: "*",
        credentials: false,
      },
    });

    // crair a room para ativar o servidor socket na room
    // const room = this.#io.of("/room");
    // room.on("connection", (socket) => {
    //   socket.emit("userConnection", "socket id se conectou " + socket.id);
    //   socket.on("joinRoom", (dados) => {
    //     console.log("dados recebidos", dados);
    //   });
    // });

    // no retorno verfica se tem erro
    return new Promise((resolve, reject) => {
      server.on("error", reject);

      server.listen(this.port, () => resolve(server));
    });
  }
}
