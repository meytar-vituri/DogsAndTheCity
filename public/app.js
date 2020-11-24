const map = L.map('map').fitWorld();

//let divMap = {};
const USE_OPEN_STREET_MAP = true;

if (USE_OPEN_STREET_MAP) {
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
  }).addTo(map);
  map.setZoom(12);
  map.panTo(new L.LatLng(32.070953, 34.763514));
} else {
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
  }).addTo(map);
}

// When set to true, the next map click will trigger dialog open for pin placement:
let pinInPlacement = false;
// Current pin coordinates, set by pressing the map
let currentPinCoords = null;
const ZOOM_TO_LOCATION = true;

// Example code to show how to get GPS location and place pin on map in that location

if (ZOOM_TO_LOCATION) {
  function onLocationFound(e) {
    let radius = e.accuracy  / 3 ;

    //if we want to see pin in location should use this 

    /*L.marker(e.latlng, {icon : dict["home"]})
        .addTo(map)
        .on('dblclick', onDoubleClick)
        .bindPopup("You are within " + radius + " meters from this point")
        .openPopup();
*/
    L.circle(e.latlng, radius).addTo(map).bindPopup("You are here");//with this we have circle in location

  }

  function onLocationError(e) {
    console.log(e.message);
  }

  map.on('locationfound', onLocationFound);
  map.on('locationerror', onLocationError);
  map.locate({setView: true, maxZoom: 16});
}

// Map press event
map.on('mousedown touchstart', function onMouseDown(event) {
  if (pinInPlacement) {
    currentPinCoords = event.latlng;
    pinInPlacement = false;

    dialog.showModal();
  }
});

// Bottom-right button press event
function addPin() {
  pinInPlacement = true;
  const pinButton = document.getElementById('add-pin-button');
  pinButton.classList.add('add-pin-button--active');
}

// Register dialog
const dialog = document.querySelector('dialog');
if (!dialog.showModal) {
  dialogPolyfill.registerDialog(dialog);
}


/*new func to add diff icons*/
function setMark(element) {
  //divMap[id]
  dialog.close();

  if (currentPinCoords) {
    L.marker(currentPinCoords, {icon :dict[element]}).addTo(map).bindPopup(element);

    const type = element;

    //we will add description later
    //const description = document.querySelector('#description').value;
    const description = "";
    const id = getRandomId();
    const data = { type, description, coords: currentPinCoords };

    fetch(`/add_point?id=${id}&data=${JSON.stringify(data)}`, {
      method: 'GET'
    });
  }
  
  deactivateAddPinButton();
};


/*
// Dialog save
dialog.getElementsByClassName('button').addEventListener('click', function () {
  dialog.close();

  if (currentPinCoords) {
    L.marker(currentPinCoords).addTo(map);

    const type = document.querySelector('#Dogs-Garden').value;
    /*
    const description = document.querySelector('#description').value;
   
    const id = getRandomId();
    const data = { type, description, coords: currentPinCoords };

    fetch(`/add_point?id=${id}&data=${JSON.stringify(data)}`, {
      method: 'GET'
    });
  }
  deactivateAddPinButton();
}); */

// Dialog close (without saving)

dialog.querySelector('.close').addEventListener('click', function () {
  dialog.close();
  deactivateAddPinButton();
});

// Dialog helper method (i.e change button color)
function deactivateAddPinButton() {
  const pinButton = document.getElementById("add-pin-button");
  pinButton.classList.remove('add-pin-button--active');
  console.log(pinButton.classList); // ['colorText', 'boldText'];

}

// Load map:
fetch('/all_points', { method: 'GET' })
  .then(result => result.json())
  .then(data => {
    Object.keys(data).forEach(
      id => {
        const pointData = JSON.parse(data[id]);
        //L.marker(pointData.coords).addTo(map);
        //L.marker(pointData.coords, {Icon : (pointData.type).toString()}).addTo(map);

        L.marker(pointData.coords , {icon :dict[pointData.type]} ).addTo(map).bindPopup(pointData.type);

      }
    );
  }
  );

// Utils
function getRandomId() {
  return Math.random().toString().substr(2, 9);
};



const buttonGrid = document.getElementById("button-grid");
/*const dialog = document.getElementById("dialog")*;*/





var marks = ["Veterinarian", "Cats area", "Dog friendly Restaurant", "Dogs Park", "Add new negative mark", "Add new positive mark",
              "Construction site", "Dog's beach", "Garbage area", "Poisonous area"];
var dict = {};
var text_dict = {"Veterinarian" : "Veterinarian.png","Cats area" :"Cats_area.png", "Dog friendly Restaurant":"Dog_friendly_Restaurant.png" ,
                  "Dogs Park" : "Dogs_Park.png", "Add new negative mark":"Add_new_negative_mark.png", "Add new positive mark" :"Add_new_positive_mark.png",
                  "Construction site":"Construction_site.png", "Dog's beach": "Dog's_beach.png", "Garbage area" :"Garbage_dump_area.png",
                  "Poisonous area":"Poisonous_area.png"};

var count = 0;
for(element of marks){
  var con = text_dict[element];

  dict[element] = L.icon({

    iconUrl: con,

    iconSize:     [30, 44], // size of the icon
    iconAnchor:   [15, 44], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -38] // point from which the popup should open relative to the iconAnchor
  });
}





var elements = [];

for(element of marks){
  var img = document.createElement('IMG');
  let but = document.createElement('button');
  let span1 = document.createElement('span');
  let span2 = document.createElement('span');

  let div = document.createElement('div');
  
  
  but.setAttribute("style", "background-color: rgb(255, 255, 255, 0); border: none;");


  div.className = "mdc-fab__ripple ";
  but.appendChild(div);
  //span1.className = "mdl-button mdl-js-button mdl-button--fab mdl-button--colored";

  var file = text_dict[element];
  img.setAttribute("src", file);
  img.setAttribute("width", "40");
  img.setAttribute("height", "60");
  
 elements.push(but);

  span2.textContent = element;
  span2.style.fontWeight = "600";
  span1.appendChild(img);

  span2.className = "my-text";

  but.className = "mdl-cell mdl-cell--2-col-phone my-fancy-container button";


  
  but.appendChild(span1);
  but.appendChild(span2);

  //div.appendChild(but);
  /*divMap['vet'] = div;*/

  buttonGrid.appendChild(but);

}  

var Veterinarian = elements[0];
Veterinarian.onclick = function() {setMark('Veterinarian')};

var Cats = elements[1];
Cats.onclick = function() {setMark('Cats area')};

var Restaurants = elements[2];
Restaurants.onclick = function() {setMark('Dog friendly Restaurant')};

var Park = elements[3];
Park.onclick = function() {setMark('Dogs Park')};

var neg_m = elements[4];
neg_m.onclick = function() {setMark('Add new negative mark')};

var pos_m = elements[5];
pos_m.onclick = function() {setMark('Add new positive mark')};

var Construction = elements[6];
Construction.onclick = function() {setMark('Construction site')};

var beach = elements[7];
beach.onclick = function() {setMark("Dog's beach")};

var Garbage = elements[8];
Garbage.onclick = function() {setMark('Garbage area')};

var Poisonous = elements[9];
Poisonous.onclick = function() {setMark("Poisonous area")};

