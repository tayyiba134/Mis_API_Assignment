function searchCountry() {
  var input = document.getElementById("countryInput").value.trim();
  var container = document.getElementById("countryContainer");
  container.innerHTML = "";

  if (input === "") {
    alert("Please enter a country name.");
    return;
  }

  var url = `https://restcountries.com/v3.1/name/${input}`;

  fetch(url)
    .then(res => res.json())
    .then(data => showInBrowser(data))
    .catch(error => {
      alert("Country not found!");
      console.error(error);
    });
}

function showInBrowser(data) {
  var container = document.getElementById("countryContainer");

  data.forEach(function (country) {
    var card = document.createElement("div");
    card.className = "country-card";

    card.innerHTML = `
      <img src="${country.flags.svg}" alt="Flag">
      <h3>${country.name.common}</h3>
      <p><strong>Region:</strong> ${country.region}</p>
      <button onclick="showDetails('${country.name.common}')">More Details</button>
    `;

    container.appendChild(card);
  });
}

function showDetails(countryName) {
  var modal = document.getElementById("modal");
  var body = document.getElementById("modalBody");

  var url = `https://restcountries.com/v3.1/name/${countryName}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      var country = data[0];
      var lat = country.latlng[0];
      var lon = country.latlng[1];

      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then(res => res.json())
        .then(weather => {
          body.innerHTML = `
            <h2>${country.name.common}</h2>
            <img src="${country.flags.svg}" width="100" />
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <p><strong>Temperature:</strong> ${weather.current_weather.temperature} °C</p>
            <p><strong>Wind Speed:</strong> ${weather.current_weather.windspeed} km/h</p>
          `;

          modal.style.display = "block";
        });
    })
    .catch(err => {
      console.error(err);
      alert("Could not fetch details.");
    });
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

  
