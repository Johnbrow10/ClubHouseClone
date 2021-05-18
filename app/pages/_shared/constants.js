//  Arquivo para pegar contants que serao usadas no projeto com padronização
export const constants = {
  socketUrl: "http://localhost:3000",
  socketNamespaces: {
    room: "room",
    lobby: "lobby",
  },
  events: {
    USER_CONNECTED: "userConnection",
    USER_DISCONNECTED: "userDisconnection",
    JOIN_ROOM: "joinRoom",
  },
};
