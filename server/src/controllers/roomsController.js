export default class RoomsController {
  constructor() {}

  onNewConnection(socket) {
    const { id } = socket;
    console.log("connection stabelished with", id);
  }

  //  capturar as funcoes publicas e privadas da classe
  getEvents() {
    // Usando o reflext para pegar as chaves das funcoes de RoomController
    const functions = Reflect.ownKeys(RoomsController.prototype)
      .filter((fn) => fn !== "constructor")
      .map(name, [
        name,
        this[name].bind(this),
      ]); /* vai mandar primeiro o nome da funcao
        e depois a funcao com o this sendo obrigatorio por isso o uso do bind */

    return new Map(functions);
  }
}
