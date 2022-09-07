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
let planeDict = {};
let flightsList=[]

let map;

function renderBaseMap() {
  map = L.map("map").setView([0, 0], 3);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
  }).addTo(map);
}

function showFlight(flights){
  

  const locationDeparture = Object.values(flights)[0].departure.location;
  const latDeparture = locationDeparture.lat;
  const longDeparture = locationDeparture.long;
  const locationDestination = Object.values(flights)[0].destination.location;
  const latDestination = locationDestination.lat;
  const longDestination = locationDestination.long;
  const latlngs = [
    [latDeparture, longDeparture],
    [latDestination,longDestination]
  ];

  L.polyline(latlngs, { color: "#0099CC" }).addTo(map);

}

function movePlane(plane) {
  const planeIcon = L.icon({
    iconUrl: "plane.png",
    iconSize: [30, 30], // size of the icon
    iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor: [15, 0], // point from which the popup should open relative to the iconAnchor
  });

  const newpopup = L.popup({
    closeOnClick: false,
    autoClose: false}).setContent(`<div class="font-mono font-bold text-cyan-600 text-xs"> Id Flight: <span class="text-slate-600"> ${plane.flight_id} </span> </div>
    <div class="font-mono font-bold text-cyan-600 text-xs "> Aerolínea:  <span class="text-slate-600"> ${plane.airline.name} </span> </div>
   <div class="font-mono font-bold text-cyan-600 text-xs "> ETA:  <span class="text-slate-600"> ${plane.ETA} </span> </div>
  <div class="font-mono font-bold	text-cyan-600 text-xs "> Status: <span class="text-slate-600"> ${plane.status} </span> </div>
  <div class="font-mono font-bold	text-cyan-600 text-xs "> Posición ->  <span class="text-slate-600"> lat: ${plane.position.lat}, long: ${plane.position.lat} </span> </div>
  <div class="font-mono font-bold	text-cyan-600 text-xs "> Distancia  <span class="text-slate-600">${plane.distance} </span> </div>
    <div class="font-mono font-bold	text-cyan-600 text-xs "> Arrival: <span class="text-slate-600"> ${plane.status} </span> </div>

 `);

  // L.marker([51.5, -0.09], { icon: landing }).addTo(map).bindPopup("Soy un aeropuerto de aterrizaje");
  const planeMarker = L.marker([plane.position.lat, plane.position.long], {icon: planeIcon}).addTo(map).bindPopup(newpopup);
  if (planeDict[plane.flight_id]) map.removeLayer(planeDict[plane.flight_id])
  planeDict[plane.flight_id] = planeMarker;
}

function insertFlight(idFlight, departure, destination, departureDate) {
  if (!flightsList.includes(idFlight)){

  const containerFlight = document.getElementById("flight-container");
  containerFlight.insertAdjacentHTML(
    "afterbegin",
    `<div  class="flex text-xs gap-1 text-center">
   <h3 class="basis-1/4 font-mono text-black p-1 bg-cyan-100"> ${idFlight} </h3>
   <h3 class="basis-1/4 font-mono text-black p-1 "> ${departure} </h3>
   <h3 class="basis-1/4 font-mono text-black p-1 "> ${destination} </h3>
   <h3 class="basis-1/4 font-mono text-black p-1 bg-slate-100"> ${departureDate} </h3>
   </div>`
  )
  flightsList.push(idFlight)}
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

function onPlaneReceived(object) {
  const plane = object.plane;
  const idFlightPlane = plane.flight_id;

  const airlinePlane = plane.airline;

  const idAirline = airlinePlane.id;
  const nameAirline = airlinePlane.name;

  const captainPlane = plane.captain;
  const positionPlane = plane.position;

  const latPosition = positionPlane.lat;
  const longPosition = positionPlane.long;

  const headingPlane = plane.heading;
  const etaPlane = plane.ETA;
  const distancePlan = plane.distance;
  const arrivalPlane = plane.arrival;
  const statusPlane = plane.status;

  movePlane(plane);
}

function onFlightsReceived(object) {
  const flights = object.flights;

  const idFlight = Object.values(flights)[0].id;

  const idDeparture = Object.values(flights)[0].departure.id;
  const departure = Object.values(flights)[0].departure.name;
  const cityDeparture = Object.values(flights)[0].departure.city;
  const locationDeparture = Object.values(flights)[0].departure.location;
  const latDeparture = locationDeparture.lat;
  const longDeparture = locationDeparture.long;
  const idCityDep = cityDeparture.id;
  const nameCityDep = cityDeparture.name;
  const countryDep = cityDeparture.country;
  const idCountryDep = countryDep.id;
  const nameCountryDep = countryDep.name;

  const idDestination = Object.values(flights)[0].destination.id;
  const destination = Object.values(flights)[0].destination.name;
  const cityDestination = Object.values(flights)[0].destination.city;
  const locationDestination = Object.values(flights)[0].destination.location;
  const latDestination = locationDestination.lat;
  const longDestination = locationDestination.long;
  const idCityDest = cityDestination.id;
  const nameCityDest = cityDestination.name;
  const countryDest = cityDestination.country;
  const idCountryDest = countryDest.id;
  const nameCountryDest = countryDest.name;

  const departureDate = Object.values(flights)[0].departure_date;

  insertFlight(
    idFlight,
    departure,
    destination,
    departureDate);

  showFlight(flights)
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
    case "plane":
      onPlaneReceived(object);
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
