import RoomsController from "./controllers/roomsController.js";
import SocketServer from "./util/socket.js";
import Event from "events";
import { constants } from "./util/constants.js";
constants;
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

//  Toda vez que haver uma conexao nova de um usuario
// ele ira razer uma funcao de nova Conexao
// namespaces.room.eventEmitter.on(
//   "userConnected",
//   namespaces.room.controller.onNewConnection.bind(namespaces.room.controller)
// );

// namespaces.room.eventEmitter.emit("userConnected", { id: "001" });
// namespaces.room.eventEmitter.emit("userConnected", { id: "002" });
// namespaces.room.eventEmitter.emit("userConnected", { id: "003" });

const routeConfig = Object.entries(namespaces).map(
  ([namespaces, { controller, eventEmitter }]) => {
    const controllerEvents = controller.getEvents();
    eventEmitter.on(
      constants.event.USER_CONNECTED,
      controller.onNewConnection.bind(controller)
    );
    return {
      [namespaces]: { events: controllerEvents, eventEmitter },
    };
  }
);

socketServer.attachEvents({ routeConfig });

console.log("socket server is running at", server.address().port);
