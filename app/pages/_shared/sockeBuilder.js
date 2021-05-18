import { constants } from "./constants.js";

export default class SocketBuilder {
  // qume usar essa classe e obrigatorio passar o socketUrl
  constructor({ socketUrl, namespace }) {
    this.socketUrl = `${socketUrl}/${namespace}`;
    this.onUserConnected = () => {};
    this.onUserDisconnected = () => {};
  }

  // entao para ter a acao do usuario criamos funcoes para realizar o padrão builder
  setOnUserConnected(fn) {
    this.onUserConnected = fn;

    return this;
  }

  setOnUserDisconnected(fn) {
    this.onUserDisconnected = fn;

    return this;
  }

  build() {
    const socket = globalThis.io.connect(this.socketUrl, {
      withCredentials: false,
    });

    // Construir as funcoes sob demanda quando o usuario
    // fazer as solicitacoes as funcoes ja estarao prontas

    socket.on("connection", () => console.log("Conectei!!"));
    socket.on(constants.events.USER_CONNECTED, () => this.onUserConnected);
    socket.on(
      constants.events.USER_DISCONNECTED,
      () => this.onUserDisconnected
    );
  }
}
