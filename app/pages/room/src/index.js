import { constants } from "../../_shared/constants.js";
import SocketBuilder from "../../_shared/sockeBuilder.js";



// Trazendo a importcao d oservidor na sala
const socketBuilder = new SocketBuilder({
  socketUrl: constants.socketUrl,
  namespace: constants.socketNamespaces.room,
});
// estabelecendo a conexao com servidor
const socket = socketBuilder
  .setOnUserConnected((user) => console.log("user connected!", user))
  .setOnUserDisconnected((user) => console.log("user disconnected!", user))
  .build();

const room = {
  id: '0001',
  topic: "JS Expert éh noix",
};

const user = {
  img: "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/batman_hero_avatar_comics-256.png",
  username: "Johnbrow",
};
//  evento join-room

socket.emit(constants.events.JOIN_ROOM, { user, room });