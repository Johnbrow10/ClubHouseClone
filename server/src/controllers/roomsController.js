import Attendee from "../entities/attendee.js";
import { constants } from "../util/constants.js";

export default class RoomsController {
  #users = new Map();
  constructor() {
    this.rooms = new Map();
  }

  onNewConnection(socket) {
    const { id } = socket;
    console.log("connection stabelished with", id);
    this.#updateGlobalUserData(id);
  }

  joinRoom(socket, { user, room }) {
    const userId = (user.id = socket.id);
    const roomId = room.id;

    const updateUserData = this.#updateGlobalUserData(userId, user, roomId);

    const updatedRoom = this.#joinUserRoom(socket, updatedUserData, room);
    this.#notifyUsersOnRoom(socket, roomId, updatedUserData);
    this.#replyWithActiveUsers(socket, updatedRoom.users);

    console.log({ updateUserData });

    socket.emit(constants.event.USER_CONNECTED, data);
  }

  #replyWithActiveUsers(socket, users) {
    const event = constants.event.LOBBY_UPDATED;
    socket.emit(event, [...users.values()]);
  }

  //  notificar todos os usuarios na sala
  #notifyUsersOnRoom(socket, roomId, user) {
    const event = constants.event.USER_CONNECTED;
    socket.to(roomId).emit(event, user);
  }

  //  Criando o gerenciamento de usuarios em uma sala
  #joinUserRoom(socket, user, room) {
    const roomId = room.id;
    const existingRoom = this.rooms.has(roomId);
    const currentRoom = existingRoom ? this.rooms.get(roomId) : {};
    const currentUser = new Attendee({
      ...user,
      roomId,
    });

    // definir quem é o dono da sala
    const [owner, users] = existingRoom
      ? [currentRoom.owner, currentRoom.users]
      : [currentUser, new Set()];

    const updatedRoom = this.#mapRoom({
      ...currentRoom,
      ...room,
      owner,
      users: new Set([...users, ...[currentUser]]),
    });

    this.rooms.set(roomId, updatedRoom);

    socket.join(roomId);

    return this.rooms.get(roomId);
  }

  // mapear na room parasaber o que cada caracteristica se aplica a cada usuario
  #mapRoom(room) {
    const users = [...room.users.values()];
    const speakersCount = users.filter((user) => user.isSpeaker).length;
    const featuredAttendees = users.slice(0, 3);
    const mappedRoom = new Room({
      ...room,
      featuredAttendees,
      speakersCount,
      attendeesCount: room.users.size,
    });

    return mappedRoom;
  }

  // function para pedir autorização quando entrar na sala
  #updateGlobalUserData(userId, userData = {}, roomId = "") {
    const user = this.#users.get(userId) ?? {};
    const existingRoom = this.rooms.has(roomId);

    const updateUserData = new Attendee({
      ...user,
      ...userData,
      roomId,
      // se for o unico na sala sempre sera o speaker
      isSpeaker: !existingRoom,
    });

    this.#users.set(userId, updateUserData);

    return this.#users.get(userId);
  }

  //  capturar as funcoes publicas e privadas da classe
  getEvents() {
    // Usando o reflext para pegar as chaves das funcoes de RoomController
    const functions = Reflect.ownKeys(RoomsController.prototype)
      .filter((fn) => fn !== "constructor")
      .map((name) => [
        name,
        this[name].bind(this),
      ]); /* vai mandar primeiro o nome da funcao
        e depois a funcao com o this sendo obrigatorio por isso o uso do bind */

    return new Map(functions);
  }
}
