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

function randomName() {
  const names = [
    "Cata ",
    "Rafa ",
    "Bernardita",
    "Mane",
    "Josefina",
    "Eugenio",
    "Diego",
  ];
  const random = Math.floor(Math.random() * names.length);
  return names[random];
}

let planeDict = {};
let flightsList = [];
let map;
let flightDict = {}

function renderBaseMap() {
  map = L.map("map").setView([0, 0], 1);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
  }).addTo(map);
}

function showFlight(flights) {
  const take_offIcon = L.icon({
    iconUrl: "take_off.png",
    iconSize: [25, 38], // size of the icon
    iconAnchor: [12, 38], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -38], // point from which the popup should open relative to the iconAnchor
  });

  const landingIcon = L.icon({
    iconUrl: "landing.png",
    iconSize: [25, 38], // size of the icon
    iconAnchor: [12, 38], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -38], // point from which the popup should open relative to the iconAnchor
  });

  const idDeparture = flights.departure.id;
  const departure = flights.departure.name;
  const cityDeparture = flights.departure.city;
  const locationDeparture = flights.departure.location;
  const latDeparture = locationDeparture.lat;
  const longDeparture = locationDeparture.long;
  const idCityDep = cityDeparture.id;
  const nameCityDep = cityDeparture.name;
  const countryDep = cityDeparture.country;
  const idCountryDep = countryDep.id;
  const nameCountryDep = countryDep.name;

  const idDestination =flights.destination.id;
  const destination = flights.destination.name;
  const cityDestination = flights.destination.city;
  const locationDestination = flights.destination.location;
  const latDestination = locationDestination.lat;
  const longDestination = locationDestination.long;
  const idCityDest = cityDestination.id;
  const nameCityDest = cityDestination.name;
  const countryDest = cityDestination.country;
  const idCountryDest = countryDest.id;
  const nameCountryDest = countryDest.name;

  const latlngs = [
    [latDeparture, longDeparture],
    [latDestination, longDestination],
  ];
  L.polyline(latlngs, { color: "#0099CC" }).addTo(map);

  const take_offPopup = L.popup({
    closeOnClick: false,
    autoClose: false,
  })
    .setContent(`<div class="font-mono font-bold text-cyan-600 text-xs"> ID Aeropuerto Salida: <span class="text-slate-600"> ${idDeparture} </span> </div>
    <div class="font-mono font-bold text-cyan-600 text-xs"> Nombre: <span class="text-slate-600"> ${departure} </span> </div>
    <div class="font-mono font-bold text-cyan-600 text-xs"> Ciudad:  <span class="text-slate-600"> ${nameCityDep} [${idCityDep}]</span> </div>
    <div class="font-mono font-bold text-cyan-600 text-xs"> País:  <span class="text-slate-600"> ${nameCountryDep} [${idCountryDep}]</span> </div>`);

  const landingPopup = L.popup({
    closeOnClick: false,
    autoClose: false,
  })
    .setContent(`<div class="font-mono font-bold text-cyan-600 text-xs"> ID Aeropuerto Llegada: <span class="text-slate-600"> ${idDestination} </span> </div>
      <div class="font-mono font-bold text-cyan-600 text-xs"> Nombre: <span class="text-slate-600"> ${destination} </span> </div>
      <div class="font-mono font-bold text-cyan-600 text-xs"> Ciudad:  <span class="text-slate-600"> ${nameCityDest} [${idCityDest}] </span> </div>
      <div class="font-mono font-bold text-cyan-600 text-xs"> País:  <span class="text-slate-600"> ${nameCountryDest} [${idCountryDest}] </span> </div> `);

  const take_offMarker = L.marker([latDeparture, longDeparture], {
    icon: take_offIcon,
  })
    .addTo(map)
    .bindPopup(take_offPopup);
  const landingMarker = L.marker([latDestination, longDestination], {
    icon: landingIcon,
  })
    .addTo(map)
    .bindPopup(landingPopup);
}

function movePlane(plane) {
  const planeIcon = L.icon({
    iconUrl: "plane.png",
    iconSize: [30, 30], // size of the icon
    iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor: [15, 0], // point from which the popup should open relative to the iconAnchor
  });

  const popupPlane = L.popup({
    closeOnClick: false,
    autoClose: false}).setContent(`<div class="font-mono font-bold text-cyan-600 text-xs"> Id Flight: <span class="text-slate-600"> ${plane.flight_id} </span> </div>
    <div class="font-mono font-bold text-cyan-600 text-xs "> Aerolínea:  <span class="text-slate-600"> ${plane.airline.name} </span> </div>
   <div class="font-mono font-bold text-cyan-600 text-xs "> ETA:  <span class="text-slate-600"> ${plane.ETA} </span> </div>
  <div class="font-mono font-bold	text-cyan-600 text-xs "> Status: <span class="text-slate-600"> ${plane.status} </span> </div>
  <div class="font-mono font-bold	text-cyan-600 text-xs "> Posición ->  <span class="text-slate-600"> lat: ${plane.position.lat}, long: ${plane.position.lat} </span> </div>
  <div class="font-mono font-bold	text-cyan-600 text-xs "> Distancia  <span class="text-slate-600">${plane.distance} </span> </div>
    <div class="font-mono font-bold	text-cyan-600 text-xs "> Arrival: <span class="text-slate-600"> ${plane.status} </span> </div>

 `);

  const planeMarker = L.marker([plane.position.lat, plane.position.long], {icon: planeIcon}).addTo(map).bindPopup(popupPlane);
  
if (planeDict[plane.flight_id]) map.removeLayer(planeDict[plane.flight_id]);
  planeDict[plane.flight_id] = planeMarker;

  //  const latlngs = [
  //   [latDeparture, longDeparture],
  //   [latDestination,longDestination]
  // ];
  // L.polyline(latlngs, { color: "#0099CC" }).addTo(map);
}

function insertFlight(flights) {
  const idFlight = flights.id;
  const departure = flights.departure.name;
  const destination = flights.destination.name;
  const departureDate = flights.departure_date;

  if (!flightsList.includes(idFlight)) {
    const containerFlight = document.getElementById("flight-container");
    containerFlight.insertAdjacentHTML(
      "beforeend",
      `<div  class="flex text-xs gap-1 text-center">
      <h3 class="basis-1/4 font-mono text-black p-1 bg-cyan-100"> ${idFlight} </h3>
      <h3 class="basis-1/4 font-mono text-black p-1 "> ${departure} </h3>
      <h3 class="basis-1/4 font-mono text-black p-1 "> ${destination} </h3>
      <h3 class="basis-1/4 font-mono text-black p-1 bg-slate-100"> ${departureDate} </h3>
      </div>`
    );
    flightsList.push(idFlight);
  }
}

function insertMessage(text, classes = "bg-cyan-600", name, date) {
  const containerChat = document.getElementById("chat-container");
  containerChat.insertAdjacentHTML(
    "beforeend",
    `<h1 class="font-mono font-semibold text-cyan-800 pt-3"> <i class="fas fa-user p-1"></i> ${name}</h1>
    <h1 class="text-zinc-700 text-xs"> ${date}</h1>
    <p class="p-2 rounded text-white ${classes}"> ${text} </p> `
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

function onCrashedReceived(flight_id) {
  console.log(`avión crashed ${flight_id}`);
}

function onLandingReceived(flight_id) {
  console.log(`avión landing ${flight_id}`);
}

function onTakeOffReceived(flight_id) {
  console.log(`avión takeoff ${flight_id}`);
}

function onPlaneReceived(object) {
  const plane = object.plane;
  movePlane(plane);
}
 
function onFlightsReceived(object) {
  const idFlightList = Object.keys(object.flights)
  const infoFlightList = Object.values(object.flights)

  console.log(infoFlightList[0].id )
  i=0
  while (i < idFlightList.length) {

    flightDict[idFlightList[i]] = infoFlightList[i]
    console.log(flightDict[idFlightList[i]].id )
    i++;
  }
const idFlightSortedList = idFlightList.sort()
i=0
while (i < idFlightSortedList.length) {
  flights = flightDict[idFlightList[i]]
  insertFlight(flights);
  showFlight(flights);
  i++;
}



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
    case "take-off":
      onTakeOffReceived(object.flight_id);
      break;
    case "landing":
      onLandingReceived(object.flight_id);
      break;
    case "crashed":
      onCrashedReceived(object.flight_id);
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
      username: randomName(),
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
