window.addEventListener('load', () => {

    // set variables select DOM elements
    let currentLocation = document.querySelector('.current-location');
    let currentTemp = document.querySelector('.current-temp');
    let currentPrecipitation = document.querySelector('.current-precipitation');
    let currentCondition = document.querySelector('.current-condition');
    let currentWind = document.querySelector('.current-wind');
    let currentUV = document.querySelector('.current-uv');
    let currentHumidity = document.querySelector('.current-humidity');
    let currentPressure = document.querySelector('.current-pressure');
    let currentLastUpdated = document.querySelector('.current-last-updated');
    let currentWeatherImg = document.querySelector('.current-weather-img');
    let currentWindDegreeImg = document.querySelector('.wind-degree-img');
    let currentChanceOfRain = document.querySelector('.current-chance-of-rain');

    // problem
    let currentTemperatureWrapper = document.querySelector('.current-temperature-wrapper');
    let currentTempSpan = document.querySelector('.temp-letter');

    // set coords
    let coordinates = {
        long : "",
        lat : ""
    };

    // get current location coordinates
    if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                coordinates.long = position.coords.longitude;
                coordinates.lat = position.coords.latitude;
        
            let api = `https://api.weatherapi.com/v1/forecast.json?key=c1e2464489474ef0acb191447220307&q=${coordinates.lat},${coordinates.long}&days=3&aqi=yes&alerts=no`;
          
            // fetch data
            fetch(api)
                .then(response => {
                return response.json();
            })
                .then(data => {
                    console.log(data);

                    const{ temp_c, temp_f, wind_kph, precip_mm, wind_degree, uv, humidity, pressure_mb, last_updated, condition: {text, icon} } = data.current;
                    const{ forecastday } = data.forecast;
                    const{ country, region } = data.location;

                    // set DOM elements from the API
                    let currentCountry = country;
                    let currentRegion = region;
                    currentLocation.textContent = currentCountry + ', ' + currentRegion;
                    currentTemp.textContent = Math.round(temp_c);
                    currentCondition.textContent = text;
                    currentWind.textContent = wind_kph + " km/h";
                    // rotate wind degree arrow by its degree
                    currentWindDegreeImg.style.transform =  'rotate(' + wind_degree + 'deg)';
                    currentUV.textContent = uv + " UV";
                    currentHumidity.textContent = humidity + " %";
                    currentPressure.textContent = pressure_mb + " kPa";
                    currentLastUpdated.textContent = 'Updated ' + last_updated;
                    currentWeatherImg.setAttribute('src', icon);
                    currentPrecipitation.textContent = precip_mm + " mm";
                    currentChanceOfRain.textContent = forecastday[0].day.daily_chance_of_rain + " %";

                    // change current temp from C to F on click
                    currentTemperatureWrapper.addEventListener('click', () => {
                        if (currentTempSpan.textContent === 'C') {
                            currentTempSpan.textContent = 'F';
                            currentTemp.textContent = Math.round(temp_f);
                        } else {
                            currentTempSpan.textContent = 'C';
                            currentTemp.textContent = Math.round(temp_c);
                        };
                    });

                    // get temp per each hour in a day
                    let hours = 24;

                    let labels = [];
                    let values = [];
                    
                    for (let i = 0; i < hours; i++) {
                        labels.push(data['forecast']['forecastday'][0]['hour'][i]['time'].slice(11));
                        values.push(Math.round(data['forecast']['forecastday'][0]['hour'][i]['temp_c']));
                    }

                    const ctx = new Chart(document.querySelector('#lineChart').getContext('2d'), {
                    
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [{
                                label: "Temperature °C",
                                data: values,
                                fill: 'start',
                                borderColor: 'aquamarine',
                                backgroundColor: 'rgba(0, 0, 50, 0.4)',
                                pointRadius: '1',
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    display: true,
                                    max: 30,
                                    min: -30,
                                    ticks: {
                                        stepSize: 10,
                                        color: 'aquamarine',
                                    }
                            },
                                x: {
                                ticks: {
                                    color: 'aquamarine',
                                }}
                            },
                            plugins: {
                                legend: {
                                    display: false,
                                }
                            }
                        }
                       
                        });
            });
        });

    }; // if navigator true
    
}); // on load