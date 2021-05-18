import RoomsController from "./controllers/roomsController.js";
import SocketServer from "./util/socket.js";
import Event from "events";

const port = process.env.PORT || 3000;
const socketServer = new SocketServer({ port });
const server = await socketServer.start();

const roomsController = new RoomsController();

const namespaces = {
  room: {
    controller: roomsController,
    eventEmitter: new Event(),
  },
};

console.log("socket server is running at", server.address().port);
