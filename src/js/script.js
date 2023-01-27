const btn = document.querySelector('button');
const input = document.querySelector('input');

const API_LINK = "http://api.openweathermap.org/geo/1.0/direct?q=";
const API_KEY = "&appid=b005763a5f5701376b641f6d866e7e64&units=metric";


// const API_LINK = "https://api.openaq.org/v1/measurements?"
// const API_KEY2 = "&key=01c3c848e13647ee97e102809ba97b43";
const API_LINK3 = "https://api.openweathermap.org/data/2.5/weather?"


const getCoordinates = () => {
    
    const city = input.value || "Wrocław"

    fetch(API_LINK + city + API_KEY)
    .then(res => res.json())
    .then(data => {
        console.log(data[0])
        const lat = `lat=${data[0].lat}`
        const lon = `&lon=${data[0].lon}`
        getWeather(lat,lon)
    })
    .catch(err => console.log('error', err));
}


const getWeather = (lat,lon) => {
    // const API_LINK2 = "http://api.openweathermap.org/data/2.5/air_pollution?";
    fetch(API_LINK3 + lat + lon + API_KEY)
     .then(res => res.json())
     .then(data => {console.log(data)})
    }


btn.addEventListener('click',getCoordinates);
// getCoordinates()
