// Utils

function uuidv4() {
  // Source: https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

// function randomName() {
//   const names = ["Catalina", "Francisca", "Rafael", "Bernardita", "Mane", "Josefina", "Eugenio"];
//   const random = Math.floor(Math.random() * names.length);
//   return names[random]
// }
//

function renderBaseMap() {
  const map = L.map("map").setView(
    [-33.499521990556495, -70.61272122258416],
    2
  );

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
  }).addTo(map);
}

function insertFlight(idFlight,idDeparture, departure, idDestination, destination, departureDate) {
  const containerFlight = document.getElementById("flight-container");
  containerFlight.insertAdjacentHTML('afterbegin', 
  `<div  class="flex text-xs gap-1 text-center">
   <h3 class="grow font-mono text-black p-1 bg-cyan-100"> ${idFlight} </h3>
   <h3 class="grow font-mono text-black p-1 bg-slate-200">${idDeparture}</h3>
   <h3 class="grow font-mono text-black p-1 "> ${departure} </h3>
   <h3 class="grow font-mono text-black p-1 bg-slate-200">${idDestination}</h3>
   <h3 class="grow font-mono text-black p-1 "> ${destination} </h3>
   <h3 class="grow font-mono text-black p-1 bg-slate-100"> ${departureDate} </h3>
   </div>`);
}

function insertMessage(text, classes = "bg-cyan-600", name, date) {
  const containerChat = document.getElementById("chat-container");
  containerChat.insertAdjacentHTML(
    "beforeend",
    `<h1 class="font-mono font-semibold text-cyan-800 pt-3"> <i class="fas fa-user p-1"></i> ${name}</h1>
    <h1 class="text-zinc-700 text-xs"> ${date}</h1>
    <p class="p-2 rounded text-white ${classes}">
            ${text}
            
      </p> `
  );
}

function onChatSend() {
  const textArea = document.getElementById("chat-input");
  const text = textArea.value;
  if (text === "") return;
  textArea.value = "";

  sendObject({
    type: "chat",
    content: text,
  });
}

function onChatKeypress(event) {
  if (event.key !== "Enter") return;
  event.preventDefault();
  document.getElementById("chat-send-button").click();
}

function setListeners() {
  document
    .getElementById("chat-send-button")
    .addEventListener("click", onChatSend);
  document
    .getElementById("chat-input")
    .addEventListener("keypress", onChatKeypress);
}

let webSocket;

function sendObject(object) {
  webSocket.send(JSON.stringify(object));
}

function onMessageReceived(object) {
  const classes = object.message.type === "warn" ? "bg-red-500" : "bg-cyan-600";

  insertMessage(
    object.message.content,
    classes,
    object.message.name,
    object.message.date
  );
  const containerChat = document.getElementById("chat-scroll-container");
  containerChat.scrollTop = containerChat.scrollHeight;
}

function onCrashedReceived(object) {}

function onLandingReceived(object) {}

function onTakeOffReceived(object) {}

function onPlaneReceived(object) {}

function onFlightsReceived(object) {
  const flights = object.flights

  const idFlight = Object.values(flights)[0].id
  const idDeparture = Object.values(flights)[0].departure.id
  const departure = Object.values(flights)[0].departure.name
  const idDestination = Object.values(flights)[0].destination.id
  const destination = Object.values(flights)[0].destination.name
  const departureDate = Object.values(flights)[0].departure_date

  insertFlight(idFlight,idDeparture,departure, idDestination, destination, departureDate);
}

function onObjectReceived(event) {
  const object = JSON.parse(event.data);
 
  switch (object.type) {
    case "message":
      onMessageReceived(object);
      break;
    case "flights":
      onFlightsReceived(object);
      break;
  }
}

function setupWebsocket() {
  webSocket = new WebSocket(
    "wss://tarea-1.2022-2.tallerdeintegracion.cl/connect"
  );
  webSocket.onopen = () => {
    sendObject({
      type: "join",
      id: uuidv4(),
      username: "Catalina",
    });
  };

  webSocket.addEventListener("message", onObjectReceived);
}

window.onload = () => {
  renderBaseMap();
  setListeners();
  setupWebsocket();
};

// let count = 0;
// setInterval(() => {
//   count++;
//   insertMessage(count);
// }, 1000);

// setTimeout(() => {
//     const textArea = document.getElementById('chat-input')
//     console.log(`the value is ${textArea.value}`)
//     textArea.value = ''
// }, 3000)
