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

function renderMessages() {
  const messages = [
    "hola mi mi niña",
    "como esta la monona",
    "yo estoy de panini",
    "y tu xd 🍌",
  ];

  messages.forEach((el) => insertMessage(el));
}

function insertMessage(text) {
  const containerChat = document.getElementById("chat-container");
  containerChat.insertAdjacentHTML(
    "beforeend",
    `<p class="p-2 rounded text-white bg-cyan-600">
            ${text}
        </p>
        `
  );
}

function onChatSend() {
  const textArea = document.getElementById("chat-input");
  const text = textArea.value;
  if (text === "") return;
  textArea.value = "";
  insertMessage(text);
  const containerChat = document.getElementById("chat-scroll-container");
  containerChat.scrollTop = containerChat.scrollHeight;
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


function onObjectReceived(event) {
  const object = JSON.parse(event.data)
  console.log(object)
}

function setupWebsocket() {
  webSocket = new WebSocket(
    "wss://tarea-1.2022-2.tallerdeintegracion.cl/connect"
  )
  webSocket.onopen = () => {
    sendObject({
      type: "join",
      id: uuidv4(),
    })
  }

  webSocket.addEventListener('message', onObjectReceived)
}

window.onload = () => {
  renderBaseMap();
  renderMessages();
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
