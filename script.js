var cityInputEl = document.querySelector('#city-input');
var submitBtn = document.querySelector('#submit');
var weatherContainerEl = document.querySelector('#weather-display');
var cityNameEl = document.querySelector('#city-name');
var cardGroup = document.querySelector('#card-group');
var savedBtn = document.querySelector('#hereThis');
var clearBtn = document.querySelector('#btnclear');
var cardsShow = document.querySelector('.card');
var hideThis = document.querySelector('#disappear');
var key = 'c515a0ec067ed1d1f189a0f9fa250561';



// ------ Local Storage for Search -------- //
var cities = JSON.parse(localStorage.getItem("cities")) || [];

// -------- on Click, Call Weather from API ---------- //
submitBtn.addEventListener("click", getCityWeather);

// -------- Function to verify a City has been Entered -------- //
function getCityWeather(event) {

  event.preventDefault();
  cardsShow.setAttribute('border', '1px');
  var search = cityInputEl.value.trim().toUpperCase();
  if (search) {

    getCityWeather(search);
    weatherContainerEl.textContent = '';
    cityNameEl.textContent = '';
    cardGroup.textContent = '';
    cityInputEl.value = '';

  } else {

    alert('Please enter a city');
  }
};

// call the api and retreive the object data from within the list property
var getCityWeather = function (city) {
  var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + key + '&units=metric';
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {

        response.json().then(function (data) {
          displayWeather(data, city);
          hideThis.style.display = "block";

        });
      } else {

        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to the Open Weather API');
    });

  cities.push(city);
  saveSearch();
  pastSearch(city);
};

// --------- Save Search ---------- //
function saveSearch() {
  localStorage.setItem("cities", JSON.stringify(cities));
};

// -------- Recall Recent Searchs from local storage -------- //
getStorage();

function getStorage() {
  var storedCities = JSON.parse(localStorage.getItem("cities"));
  if (storedCities === null) {

    return;
  }

  for (var i = 0; i < storedCities.length; i++) {
    var cityButton = document.createElement('button');
    cityButton.classList = 'btn btn-warning mt-3';
    cityButton.setAttribute('data', storedCities[i]);
    cityButton.setAttribute('id', 'click');
    savedBtn.appendChild(cityButton);
    cityButton.textContent = storedCities[i];
  
  }
  if (storedCities !== null) {
    cities = storedCities;
  }
};

// ------ Makes Recent Search into Button ------- //
var pastSearch = function (city) {
  var cityButton = document.createElement('button');
  cityButton.classList = 'btn btn-warning mt-3';
  cityButton.setAttribute('data', city);
  cityButton.setAttribute('id', 'click');
  savedBtn.appendChild(cityButton);
  cityButton.textContent = city;
};

// ------ Recalls Weather when you click on Recent Searched City ------ // 
var pastSearchHandler = function (event) {
  var city = event.target.getAttribute("data")
  weatherContainerEl.textContent = '';
  cityNameEl.value = '';
  cardGroup.textContent = '';
  var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + key + '&units=metric';
  
  fetch(apiUrl)
    .then(function (response) {
      
      if (response.ok) {
        response.json().then(function (data) {
          displayWeather(data, city);
          hideThis.style.display = "block";
        });
      
      } else {

        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to the Open Weather API');
    });
};

// when clicked on a history button run the pastSearchHandler
savedBtn.addEventListener("click", pastSearchHandler);

// ------- Todays Weather in Main Card -------- //
function displayWeather(data, city) {
  if (data.list.length === 0) {
    weatherContainerEl.textContent = 'No weather found.';
    return;
  }

  // -------- Show City Name and Current Date Weather on Main Card ---------- //
  cityNameEl.textContent = city + ", " + data.city.country;
  for (let i = 0; i < 1; i++) {
    var date = data.list[i].dt_txt;
    var temp = data.list[i].main.temp;
    var wind = data.list[i].wind.speed;
    var humidity = data.list[i].main.humidity;
    var iconWeather = data.list[i].weather[0].icon;
    var justDate = date.split(' ');
    var justTemp = Math.round(temp);

      // ---- Current Date ---- //
      dateEl = document.createElement('h4');
      var formatDate = moment(justDate[0]).format('dddd, MMMM Do YYYY');
      dateEl.textContent = formatDate;
      weatherContainerEl.appendChild(dateEl);
      
      // ---- Weather Icon ---- //
      iconEl = document.createElement('img');
      iconEl.setAttribute('src', 'https://openweathermap.org/img/wn/' + iconWeather + '@2x.png');
      weatherContainerEl.appendChild(iconEl);

      // ---- Current Temp ---- //
      tempEl = document.createElement('h4');
      tempEl.textContent = "Temp: " + justTemp + "\xB0F";
      weatherContainerEl.appendChild(tempEl);

      // ---- Current Humidity ---- //
      humidEl = document.createElement('h4');
      humidEl.textContent = "Humidity: " + humidity + "%";
      weatherContainerEl.appendChild(humidEl);

      // ---- Current Wind ---- //
      windEl = document.createElement('h4');
      windEl.textContent = "Wind: " + wind + " km/h";
      weatherContainerEl.appendChild(windEl);

      // ---- Current UV Index ---- //
      var lat = data.city.coord.lat;
      var lon = data.city.coord.lon;
      getUvIndex(lat, lon);
      getFiveDay(data);
    }
};

function getFiveDay(data) {
  // --------- 5-Day Forecast Cards ----------- //
  var forecast = data.list;

  for (var i = 0; i < forecast.length; i++) {
    var date = data.list[i].dt_txt;
    var iconic = data.list[i].weather[0].icon;
    var temp = data.list[i].main.temp;
    var wind = data.list[i].wind.speed;
    var humidity = data.list[i].main.humidity;
    var justDate = date.split(' ');
    var formatDate = moment(justDate[0]).format('dddd');

    // ------- Return Day-Time Forcast -------- //
    if (justDate[1] === "03:00:00") {

      // ------ Creates a New Card for each New Day ------ //
      newCard = document.createElement('div');
      newCard.classList = 'card text-white bg-primary m-1';
      cardGroup.appendChild(newCard);
      innerCard = document.createElement('div');
      innerCard.classList = 'card-body';
      newCard.appendChild(innerCard);

      // ------  Weather date ------ //
      cardContent = document.createElement('h4');
      cardContent.textContent = formatDate;
      innerCard.appendChild(cardContent);

      // ------ Weather Icon ------- //
      cardContent = document.createElement("img")
      cardContent.setAttribute('src', 'https://openweathermap.org/img/wn/' + iconic + '@2x.png');
      innerCard.appendChild(cardContent);

      // ------ Weather Temp ------- //
      var justtemp = Math.round(temp);
      cardContent = document.createElement('h4');
      cardContent.textContent = "Temp: " + justtemp + "\xB0F";
      innerCard.appendChild(cardContent);

      // ----- Weather Humidity ------ //
      cardContent = document.createElement('h4');
      cardContent.textContent = "Humidity: " + humidity + "%";
      innerCard.appendChild(cardContent);

      // ------ Weather Winds ------ //
      cardContent = document.createElement('h4');
      cardContent.textContent = "Wind: " + wind + " km/h";
      innerCard.appendChild(cardContent);
    }
  }
};

// ------- API Call to Retreive UV index ------- //
var getUvIndex = function (lat, lon) {
  var apiURL = 'https://api.openweathermap.org/data/2.5/uvi?appid=' + key + '&lat=' + lat + '&lon=' + lon;
  fetch(apiURL)
    .then(function (response) {
      response.json().then(function (data) {
        displayUvIndex(data);
      });
    });
};

// ----- Display UV index to Today's weather ------- //
// -------- and give the Icon based on updated value ------- //

var displayUvIndex = function (index) {
  uvIndexValue = document.createElement("h4")
  uvIndexValue.textContent = "UV Index: " + index.value;
  
  if (index.value <= 2) {
    uvIndexValue.classList = "favorable"
  
  } else if (index.value > 2 && index.value <= 8) {
    uvIndexValue.classList = "moderate "
  
  } else if (index.value > 8) {
    uvIndexValue.classList = "severe"
  
  };
  weatherContainerEl.appendChild(uvIndexValue);
}

// on click of Clear Button - runs clear storage
clearBtn.addEventListener("click", clearStorage);

function clearStorage() {
  localStorage.clear();
  savedBtn.innerHTML = "";
  weatherContainerEl.textContent = '';
  cityNameEl.value = '';
  cardGroup.textContent = '';
  cities = [];
  hideThis.style.display = "none";
};