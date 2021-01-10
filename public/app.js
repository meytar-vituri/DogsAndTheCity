const map = L.map('map').fitWorld();

//let divMap = {};
const USE_OPEN_STREET_MAP = true;
const temporaryMarkerTypes = ["Report Poop on sidewalk", "Report Dog without owner", "Cats area", "Dogs Park", "Garbage area", "Poisonous area"]; //types for temporary markers
const dayInMilliSeconds = (24 * 60 * 60 * 1000); //24 hours in millisenconds. used to remove dynamicIconcs
function removePinFromDB(id) {
  fetch(`/delete_point?id=${id}&data=${JSON.stringify(id)}`, {
    method: 'GET'
  });

}

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
var my_location = L.icon({
  iconUrl: 'my_location.png',
  iconSize: [30, 30], // size of the icon
  iconAnchor: [15, 15], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -30] // point from which the popup should open relative to the iconAnchor
})

let locationMarker;
let locationRadius;

if (ZOOM_TO_LOCATION) {
  function onLocationFound(e) {
    let radius = e.accuracy / 3;
    if (locationMarker) {
      map.removeLayer(locationMarker);
    }
    if (locationRadius) {
      map.removeLayer(locationRadius);
    }

    locationMarker = L.marker(e.latlng, { icon: my_location })
      .addTo(map)
      .bindPopup("You are here");
    locationRadius = L.circle(e.latlng, radius).addTo(map);
  }

  function onLocationError(e) {
    console.log(e.message);
  }

  function onLocationUpdateFound(e) {
    const latlng = L.latLng(e.coords.latitude, e.coords.longitude);
    locationMarker.setLatLng(latlng);
    locationRadius.setLatLng(latlng);
  }

  function onLocationUpdateError(e) {
    console.log(e.message);
  }

  var G_options = {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 30000
  };

  map.on('locationfound', onLocationFound);
  map.on('locationerror', onLocationError);
  map.locate({ setView: true, maxZoom: 16 });
  navigator.geolocation.watchPosition(onLocationUpdateFound, onLocationUpdateError, G_options);
}

// Map press event
map.on('mousedown touchstart', function onMouseDown(event) {
  if (pinInPlacement) {
    currentPinCoords = event.latlng;
    pinInPlacement = false;
    add_pin_dialog.showModal();
  }
});

// Bottom-right button press event
function addPin() {
  pinInPlacement = true;
  const pinButton = document.getElementById('add-pin-button');
  pinButton.classList.add('button--active');
}

// Register add pin dialog
const add_pin_dialog = document.getElementById("add_pin_dialog");
if (!add_pin_dialog.showModal) {
  dialogPolyfill.registerDialog(add_pin_dialog);
}

function setShouldBeChecked(mark, shouldBeChecked) {
  for (element of filter_form.elements) {
    if (element.type == "checkbox" && element.id == mark) {
      element.checked = shouldBeChecked;
    }
  }
}
function openFilterPinsWindow() {
  // set for each marker if its checkbox should be checked
  for (mark of checked_marks) {
    setShouldBeChecked(mark, true);
  }
  select_all_checkbox.checked = (checked_marks.length === marks.length);
  const filterButton = document.getElementById('filter-pins-button');
  filterButton.classList.add('button--active');
  const filter_pins_dialog = document.getElementById("filter_pins_dialog");
  if (!filter_pins_dialog.showModal) {
    dialogPolyfill.registerDialog(filter_pins_dialog);
  }
  filter_pins_dialog.showModal();
}



/*new func to add diff icons*/
function setMark(element) {
  //divMap[id]
  add_pin_dialog.close();

  if (currentPinCoords) {
    var new_marker = L.marker(currentPinCoords, { icon: dict[element] });
    new_marker.addTo(map).bindPopup(element);
    const type = element;
    console.log(all_points_dict[type]);
    all_points_dict[type].push(new_marker);
    console.log(all_points_dict[type]);
    if (!checked_marks.includes(type)){
      checked_marks.push(type);
    }
    //we will add description later
    //const description = document.querySelector('#description').value;
    var description = "";
    const id = getRandomId();
    const createdTime = (new Date).getTime();
    if (temporaryMarkerTypes.includes(type)) {
      var expirationTime = new Date(createdTime + dayInMilliSeconds - (new Date).getTimezoneOffset() * 60 * 1000);
      description = description + "\n expires on " + expirationTime.toUTCString().slice(0, -7);
    }
    const data = { type, description, coords: currentPinCoords, createdTime };


    console.log(description);
    fetch(`/add_point?id=${id}&data=${JSON.stringify(data)}`, {
      method: 'GET'
    });
  }

  deactivateAddPinButton();
};


// Dialog close (without saving)

add_pin_dialog.querySelector('.close').addEventListener('click', function () {
  add_pin_dialog.close();
  deactivateAddPinButton();
});

// Dialog helper method (i.e change button color)
function deactivateAddPinButton() {
  const pinButton = document.getElementById("add-pin-button");
  pinButton.classList.remove('button--active');
  console.log(pinButton.classList); // ['colorText', 'boldText'];

}

// filter Dialog close (without saving)

filter_pins_dialog.querySelector('.close').addEventListener('click', function () {
  filter_pins_dialog.close();
  deactivateFilterButton();
});

// Dialog helper method (i.e change button color)
function deactivateFilterButton() {
  const filterButton = document.getElementById("filter-pins-button");
  filterButton.classList.remove('button--active');

}

// Load map:


fetch('/all_points', { method: 'GET' })
  .then(result => result.json())
  .then(data => {
    console.log(Object.keys(data));
    currentTime = new Date;
    Object.keys(data).forEach(
      id => {
        const pointData = JSON.parse(data[id]);
        if (temporaryMarkerTypes.includes(pointData.type)) {
          const elpasedTime = (currentTime.getTime() - pointData.createdTime); /*  time in milliseconds*/
          if (elpasedTime > dayInMilliSeconds) { //delete point after a day
            removePinFromDB(id);
            return;
          }
        }
        console.log(pointData);
        //L.marker(pointData.coords).addTo(map);
        //L.marker(pointData.coords, {Icon : (pointData.type).toString()}).addTo(map);

        const new_marker = L.marker(pointData.coords, { icon: dict[pointData.type] });
        new_marker.addTo(map).bindPopup("<b>" + pointData.type + "</b><br>" + pointData.description);
        all_points_dict[pointData.type].push(new_marker);

      }
    );
  }
  );

// Utils
function getRandomId() {
  return Math.random().toString().substr(2, 9);
};



const buttonGrid = document.getElementById("button-grid");
const checkBoxGrid = document.getElementById("checkbox_grid");
/*const dialog = document.getElementById("dialog")*;*/





var marks = ["Report Poop on sidewalk", "Report Dog without owner", "Veterinarian", "Cats area", "Dog friendly Restaurant", "Dogs Park",
  "Construction site", "Dog's beach", "Garbage area", "Poisonous area", "Crowded Area", "Saki-Kaki", "Water Area", "Inspector", "Pets Shop"];
checked_marks = [].concat(marks);
var all_points_dict = {};
for (mark of marks){
  all_points_dict[mark] = [];
}
var dict = {};
var markers_dict = {
  "Report Poop on sidewalk": "markers/Report_Poop_on_sidewalk_mark.png", "Report Dog without owner": "markers/Report_Dog_without_owner_mark.png", "Veterinarian": "markers/Veterinarian.png", "Cats area": "markers/Cats_area.png", "Dog friendly Restaurant": "markers/Dog_friendly_Restaurant.png",
  "Dogs Park": "markers/Dogs_Park.png",
  "Construction site": "markers/Construction_site.png", "Dog's beach": "markers/Dog's_beach.png", "Garbage area": "markers/Garbage_dump_area.png",
  "Poisonous area": "markers/Poisonous_area.png", "Crowded Area": "markers/crowded_area_mark.png", "Saki-Kaki": "markers/saki-kaki_mark.png",
  "Water Area": "markers/water_mark.png", "Inspector": "markers/inspector_mark.png", "Pets Shop": "markers/pets_shop_mark.png"
};

var dialog_dict = {
  "Report Poop on sidewalk": "Buttons/Report_Poop_on_sidewalk_Button.png", "Report Dog without owner": "Buttons/Report_Dog_without_owner_Button.png", "Veterinarian": "Buttons/Veterinarian_Button.png", "Cats area": "Buttons/Cats_area_Button.png", "Dog friendly Restaurant": "Buttons/Dog_friendly_Restaurant_Button.png",
  "Dogs Park": "Buttons/Dogs_Park_Button.png",
  "Construction site": "Buttons/Construction_site_Button.png", "Dog's beach": "Buttons/Dog's_beach_Button.png", "Garbage area": "Buttons/Garbage_dump_area_Button.png",
  "Poisonous area": "Buttons/Poisonous_area_Button.png", "Crowded Area": "Buttons/crowded_area_Button.png", "Saki-Kaki": "Buttons/saki-kaki_Button.png",
  "Water Area": "Buttons/water_Button.png", "Inspector": "Buttons/inspector_Button.png", "Pets Shop": "Buttons/pets_shop_Button.png"
};

var count = 0;
for (element of marks) {
  dict[element] = L.icon({
    iconUrl: markers_dict[element],
    iconSize: [30, 44], // size of the icon
    iconAnchor: [15, 44], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -38] // point from which the popup should open relative to the iconAnchor
  });
}


function create_add_button(element) {
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
  buttonGrid.appendChild(but);
};

function add_to_filter_dialog(mark) {
  var img = document.createElement('IMG');
  let markCheckBox = document.createElement('input');
  markCheckBox.setAttribute('type', "checkbox");
  markCheckBox.setAttribute('id', mark);
  let markDiv = document.createElement('div');
  let imgSpan = document.createElement('span');
  let cbSpan = document.createElement('span');
  cbSpan.appendChild(markCheckBox);
  let textSpan = document.createElement('span');
  //let div = document.createElement('div');

  //but.setAttribute("style", "background-color: rgb(255, 255, 255, 0); border: none;");
  markDiv.setAttribute('class', 'mdl-cell mdl-cell--2-col-phone');
  //markDiv.className = "mdc-fab__ripple ";
  //but.appendChild(div);

  var markImgFile = dialog_dict[mark];
  img.setAttribute("src", markImgFile);
  img.setAttribute("width", "50");
  img.setAttribute("height", "50");


  textSpan.textContent = mark;
  textSpan.style.fontWeight = "600";
  imgSpan.appendChild(img);

  textSpan.className = "my-text";

  //but.className = "mdl-cell mdl-cell--2-col-phone my-fancy-container button";

  markDiv.appendChild(cbSpan);
  markDiv.appendChild(imgSpan);
  markDiv.appendChild(textSpan);
  checkBoxGrid.appendChild(markDiv);
};


function show_info() {

};

function filter_points(form_element) {
  //updating the checked_marks array according to the checked boxes in the dialog.
  for (element of filter_form.elements) {
    if (element.type == "checkbox") {
      if (element.id != "selectall") {
        if(element.checked === true){
          if (!checked_marks.includes(element.id)){
            checked_marks.push(element.id);
          }
        } else {
          var mark_index = checked_marks.indexOf(element.id);
          if (mark_index > -1) {
            checked_marks.splice(mark_index, 1);
          }
        }
      } 
    }
  }
  rerender_map();
  filter_pins_dialog.close();
  deactivateFilterButton();
}

function rerender_map(){
  for (var key of Object.keys(all_points_dict)){
    console.log(key);
    if (checked_marks.includes(key)){
      for (index in all_points_dict[key]){
        var marker = all_points_dict[key][index]; 
        console.log(marker);
        if(map.hasLayer(marker)){
          continue;
        } else {
          marker.addTo(map);
        }
      }
    }else {
      for (index in all_points_dict[key]){
        var marker = all_points_dict[key][index]; 
        console.log(marker);
        if(map.hasLayer(marker)){
          map.removeLayer(marker);
        } 
      }
    }
  }
  console.log("loop finished!");
  return;
}

function create_info_button() {
  let but = document.createElement('button');
  let div = document.createElement('div');
  let span = document.createElement('span');

  /*
  <button id="info-button" onclick="show_info()" class="mdc-fab info_style">
    <div class="mdc-fab__ripple"></div>
    <span class="mdc-fab__icon material-icons">info</span>
  </button>
*/

  but.id = "info-button";
  but.onclick = show_info();
  but.className = "mdc-fab info_style";
  div.className = "mdc-fab__ripple";
  span.className = "mdc-fab__icon material-icons";
  span.textContent = "info";

  but.appendChild(div);
  but.appendChild(span);
  body.appendChild(but);

};

var elements = [];

//Set add dialog contents
for (element of marks) {
  create_add_button(element);
};
//Set filter dialog contents
let select_all_div = document.getElementById('select_all_div');
const select_all_grid = document.getElementById('checkbox_grid');
let select_all_checkbox = document.createElement('input');
select_all_checkbox.setAttribute('type', 'checkbox');
select_all_checkbox.setAttribute('id', 'selectall');
let select_all_cb_span = document.createElement('span');
let selectAllTextSpan = document.createElement('span');
select_all_cb_span.appendChild(select_all_checkbox);
selectAllTextSpan.textContent = "Select All";
selectAllTextSpan.style.fontWeight = "600";
selectAllTextSpan.className = "my-text";
select_all_div.appendChild(select_all_cb_span);
select_all_div.appendChild(selectAllTextSpan);
for (mark of marks) {
  add_to_filter_dialog(mark);
};

const filter_form = document.getElementById("filter_form");
select_all_checkbox.onclick = function () {
  var shouldCheck;
  if (select_all_checkbox.checked == true) {
    shouldCheck = true;
  }
  else {
    shouldCheck = false;
  }
  for (element of filter_form.elements) {
    if (element.type == "checkbox") {
      if (element.id != "selectall") {
        element.checked = shouldCheck;
      }
    }
  }
};



var Report_Poop = elements[0];
Report_Poop.onclick = function () { setMark('Report Poop on sidewalk') };

var Report_Dog = elements[1];
Report_Dog.onclick = function () { setMark('Report Dog without owner') };


var Veterinarian = elements[2];
Veterinarian.onclick = function () { setMark('Veterinarian') };

var Cats = elements[3];
Cats.onclick = function () { setMark('Cats area') };

var Restaurants = elements[4];
Restaurants.onclick = function () { setMark('Dog friendly Restaurant') };

var Park = elements[5];
Park.onclick = function () { setMark('Dogs Park') };
/*
var neg_m = elements[4];
neg_m.onclick = function() {setMark('Add new negative mark')};
var pos_m = elements[5];
pos_m.onclick = function() {setMark('Add new positive mark')};
*/
var Construction = elements[6];
Construction.onclick = function () { setMark('Construction site') };
var beach = elements[7];
beach.onclick = function () { setMark("Dog's beach") };
var Garbage = elements[8];
Garbage.onclick = function () { setMark('Garbage area') };
var Poisonous = elements[9];
Poisonous.onclick = function () { setMark("Poisonous area") };

var Crowded = elements[10];
Crowded.onclick = function () { setMark("Crowded Area") };
var Saki = elements[11];
Saki.onclick = function () { setMark("Saki-Kaki") };
var Water = elements[12];
Water.onclick = function () { setMark("Water Area") };
var Inspector = elements[13];
Inspector.onclick = function () { setMark("Inspector") };
var Shop = elements[14];
Shop.onclick = function () { setMark("Pets Shop") };


