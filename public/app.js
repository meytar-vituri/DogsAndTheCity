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
  localStorage.setItem(349387598, JSON.stringify({"type":"Dogs Park" ,"description":"גינת כלבים מדהימה","coords":{"lat":"32.090625","lng":"34.776295"}}));
  localStorage.setItem(349387597, JSON.stringify({"type":"Dogs Park" ,"description":"גינת כלבים עובדיה הנביא","coords":{"lat":"32.093861 ","lng":"34.777291"}}));
  localStorage.setItem(349387596, JSON.stringify({"type":"Dogs Park" ,"description":"גינת כלבים עובדיה בילטמור","coords":{"lat":"32.088810","lng":"34.787687"}}));
  localStorage.setItem(349387595, JSON.stringify({"type":"Dogs Park" ,"description":"גינת כלבים עובדיה אוסישקין","coords":{"lat":"32.095292","lng":"34.781428"}}));
  localStorage.setItem(349387594, JSON.stringify({"type":"Veterinarian" ,"description":"טלי אברהם, וטרינרית","coords":{"lat":"32.090631","lng":"34.776009"}}));
fetch('/all_points', { method: 'GET' })
  .then(result => result.json())
  .then(data => {
	console.log(Object.keys(data));
    Object.keys(data).forEach(
      id => {
        const pointData = JSON.parse(data[id]);
	console.log(pointData);
        //L.marker(pointData.coords).addTo(map);
        //L.marker(pointData.coords, {Icon : (pointData.type).toString()}).addTo(map);

        L.marker(pointData.coords , {icon :dict[pointData.type]} ).addTo(map).bindPopup(pointData.type.concat(pointData.description));

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
var markers_dict = {"Veterinarian" : "markers/Veterinarian.png","Cats area" :"markers/Cats_area.png", "Dog friendly Restaurant":"markers/Dog_friendly_Restaurant.png" ,
                  "Dogs Park" : "markers/Dogs_Park.png", "Add new negative mark":"markers/Add_new_negative_mark.png", "Add new positive mark" :"markers/Add_new_positive_mark.png",
                  "Construction site":"markers/Construction_site.png", "Dog's beach": "markers/Dog's_beach.png", "Garbage area" :"markers/Garbage_dump_area.png",
                  "Poisonous area":"markers/Poisonous_area.png"};

var dialog_dict = {"Veterinarian" : "Buttons/Veterinarian_Button.png","Cats area" :"Buttons/Cats_area_Button.png", "Dog friendly Restaurant":"Buttons/Dog_friendly_Restaurant_Button.png" ,
                  "Dogs Park" : "Buttons/Dogs_Park_Button.png", "Add new negative mark":"Add_new_negative_mark_Button.png", "Add new positive mark" :"Buttons/Add_new_positive_mark_Button.png",
                  "Construction site":"Buttons/Construction_site_Button.png", "Dog's beach": "Buttons/Dog's_beach_Button.png", "Garbage area" :"Buttons/Garbage_dump_area_Button.png",
                  "Poisonous area":"Buttons/Poisonous_area_Button.png"};

var count = 0;
for(element of marks){
  dict[element] = L.icon({
    iconUrl: markers_dict[element],
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

  var file = dialog_dict[element];
  img.setAttribute("src", file);
  img.setAttribute("width", "50");
  img.setAttribute("height", "50");
  
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

