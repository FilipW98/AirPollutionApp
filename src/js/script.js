const okBtn = document.querySelector('.ok');
const input = document.querySelector('input');

const pm10Info = document.querySelector('.category-box__info-pm10');
const pm25Info = document.querySelector('.category-box__info-pm25');
const coInfo = document.querySelector('.category-box__info-co');
const so2Info = document.querySelector('.category-box__info-so2');
const infoIcons = document.querySelectorAll('.info');
const infoCards = document.querySelectorAll('.category-box__info');

const info1 = document.querySelector('#one');
const info2 = document.querySelector('#two');
const info3 = document.querySelector('#three');
const info4 = document.querySelector('#four');

// Pollution=========
const pollutionIcon = document.querySelector('.air-weather__img');
const pollutionWord = document.querySelector('#air-quality');

const pm10 = document.querySelector('#pm10');
const pm25 = document.querySelector('#pm25');
const co = document.querySelector('#co');
const so2 = document.querySelector('#so2');

//Weather==============
const weatherIcon = document.querySelector('.weather-type__img');
const weatherWord = document.querySelector('.weather-type__title');

const temp = document.querySelector('#temp');
const feel = document.querySelector('#feel');
const hum = document.querySelector('#hum');
const wind = document.querySelector('#wind');

const cityName = document.querySelector('.adress__city');
const cityerror = document.querySelector('.city-error');

const API_LINK = 'https://api.openweathermap.org/geo/1.0/direct?q=';
const API_KEY = '&appid=b005763a5f5701376b641f6d866e7e64&units=metric';



const getCoordinates = () => {
	const city = input.value || 'Wrocław';
	pm25.parentElement.style.backgroundColor = 'rgba(213, 212, 212, 0.205)';
	pm10.parentElement.style.backgroundColor = 'rgba(213, 212, 212, 0.205)';
	co.parentElement.style.backgroundColor = 'rgba(213, 212, 212, 0.205)';
	so2.parentElement.style.backgroundColor = 'rgba(213, 212, 212, 0.205)';

	fetch(API_LINK + city + API_KEY)
		.then(res => res.json())
		.then(data => {
			const lat = `lat=${data[0].lat}`;
			const lon = `&lon=${data[0].lon}`;
			getAirPollution(lat, lon);
			getWeather(lat, lon);
		})
		.catch(() => {
			cityerror.textContent = 'Wpisz poprawną nazwę miasta!';
			input.value = '';
			input.setAttribute('placeholder', 'Podaj nazwę miasta');
		});
};

const getAirPollution = (lat, lon) => {
	const API_LINK2 = 'https://api.openweathermap.org/data/2.5/air_pollution?';
	fetch(API_LINK2 + lat + lon + API_KEY)
		.then(res => res.json())
		.then(data => {
			pm10.textContent = data.list[0].components.pm10.toFixed(1) + ' uq/m3';
			pm25.textContent = data.list[0].components.pm2_5.toFixed(1) + ' uq/m3';
			co.textContent = data.list[0].components.co.toFixed(1) + ' uq/m3';
			so2.textContent = data.list[0].components.so2.toFixed(1) + ' uq/m3';

			if (data.list[0].main.aqi === 1) {
				pollutionWord.textContent = 'Dobra';
				pollutionWord.style.color = 'lime';
				pollutionIcon.setAttribute('src', 'dist/img/smile.png');
			} else if (data.list[0].main.aqi === 2) {
				pollutionWord.textContent = 'Średnia';
				pollutionWord.style.color = 'orange';
				pollutionIcon.setAttribute('src', 'dist/img/confused.png');
			} else if (data.list[0].main.aqi >= 3) {
				pollutionWord.textContent = 'Zła';
				pollutionWord.style.color = 'red';
				pollutionIcon.setAttribute('src', 'dist/img/mask.png');
			}

			if (data.list[0].components.pm2_5 >= 10) {
				pm25.parentElement.style.backgroundColor = 'rgba(207, 18, 49, 0.664)';
			}
			if (data.list[0].components.pm10 >= 20) {
				pm10.parentElement.style.backgroundColor = 'rgba(207, 18, 49, 0.664)';
			}
			if (data.list[0].components.co >= 15000) {
				co.parentElement.style.backgroundColor = 'rgba(207, 18, 49, 0.664)';
			}
			if (data.list[0].components.so2 >= 125) {
				so2.parentElement.style.backgroundColor = 'rgba(207, 18, 49, 0.664)';
			}
		});
};

const getWeather = (lat, lon) => {
	const API_LINK3 = 'https://api.openweathermap.org/data/2.5/weather?';

	fetch(API_LINK3 + lat + lon + API_KEY)
		.then(res => res.json())
		.then(data => {
			console.log(data);
			if (input.value === '') {
				input.setAttribute('placeholder', 'Musisz podać nazwę miasta');
				cityName.textContent = 'WROCŁAW';
			} else {
				cityName.textContent = input.value.toUpperCase();
				input.setAttribute('placeholder', 'Podaj nazwę miasta');
				input.value = '';
				cityerror.textContent = '';
			}
			const mPerS = data.wind.speed;
			const kmPerH = (mPerS * 3.6).toFixed(1);
			temp.textContent = data.main.temp.toFixed(1) + ' ℃';
			feel.textContent = data.main.feels_like.toFixed(1) + ' ℃';
			hum.textContent = data.main.humidity + ' %';
			wind.textContent = kmPerH + ' km/h';
			if (data.weather[0].id < 233) {
				weatherIcon.setAttribute('src', 'dist/img/thunderstorm.png');
				weatherWord.textContent = 'Burza';
			} else if (data.weather[0].id > 299 && data.weather[0].id < 500) {
				weatherIcon.setAttribute('src', 'dist/img/drizzle.png');
				weatherWord.textContent = 'Mżawka';
			} else if (data.weather[0].id >= 500 && data.weather[0].id < 600) {
				weatherIcon.setAttribute('src', 'dist/img/rain.png');
				weatherWord.textContent = 'Deszczowo';
			} else if (data.weather[0].id >= 600 && data.weather[0].id < 701) {
				weatherIcon.setAttribute('src', 'dist/img/ice.png');
				weatherWord.textContent = 'Śnieg';
			} else if (data.weather[0].id >= 701 && data.weather[0].id < 800) {
				weatherIcon.setAttribute('src', 'dist/img/fog.png');
				weatherWord.textContent = 'Mgliśnie';
			} else if ((data.weather[0].id = 800)) {
				weatherIcon.setAttribute('src', 'dist/img/sun.png');
				weatherWord.textContent = 'Czyste niebo';
			} else {
				weatherIcon.setAttribute('src', 'dist/img/cloud.png');
				weatherWord.textContent = 'Pochmurno';
			}
		});
};




for (let i = 0; i < infoIcons.length; i++) {
	infoIcons[i].addEventListener('mouseenter', function () {
		infoCards[i].style.display = "block";
	});
}

for (let i = 0; i < infoIcons.length; i++) {
	infoIcons[i].addEventListener('mouseleave', function () {
		infoCards[i].style.display = "none";
	});

}

const pressEnter = e => {
	e.preventDefault();
	if (e.keyCode === 13) {
		getCoordinates();
	}
};

okBtn.addEventListener('click', getCoordinates);
input.addEventListener('keyup', pressEnter);
