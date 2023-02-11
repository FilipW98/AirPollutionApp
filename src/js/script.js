const okBtn = document.querySelector('.ok');
const input = document.querySelector('input');
const infoIcons = document.querySelectorAll('.info');
const infoCards = document.querySelectorAll('.category-box__card-info');

// Pollution=========
const pollutionIcon = document.querySelector('.air-weather__air-quality-img');
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

const cityName = document.querySelector('.adress__name-city');
const cityerror = document.querySelector('.city-error');

const API_LINK = 'https://api.openweathermap.org/geo/1.0/direct?q=';
const API_KEY = '&appid=b005763a5f5701376b641f6d866e7e64&units=metric';

const mediaQuery = window.matchMedia('(max-width: 576px)');
const pollution = document.querySelector('.pollution');
const weatherStats = document.querySelector('.weather-stats');
const airWeather = document.querySelector('.air-weather__air-quality');
const airWeatherBox = document.querySelector('.air-weather');
const weatherType = document.querySelector('.weather-type');
const statiscticsBox = document.querySelector('.statisctics-box');
const adress = document.querySelector('.adress');


const horizontalMobileLine = document.createElement('div');
const horizontalMobileLineTwo = document.createElement('div');
horizontalMobileLine.classList.add('mobile-line-one');
horizontalMobileLineTwo.classList.add('mobile-line-two');
adress.appendChild(horizontalMobileLine);
adress.appendChild(horizontalMobileLineTwo);

if (mediaQuery.matches) {
	airWeather.appendChild(pollution);
	weatherType.appendChild(weatherStats);
	airWeather.appendChild(adress);
	console.log('ok');
} else {
	console.log('git');
	statiscticsBox.appendChild(pollution);
	statiscticsBox.appendChild(weatherStats);
	statiscticsBox.appendChild(adress);
}

mediaQuery.addEventListener('change', function (event) {
	if (event.matches) {
		airWeather.appendChild(pollution);
		weatherType.appendChild(weatherStats);
		airWeather.appendChild(adress);
		console.log('ok2');
	} else {
		console.log('git2');
		statiscticsBox.appendChild(pollution);
		statiscticsBox.appendChild(weatherStats);
		statiscticsBox.appendChild(adress);
	}
});

const getCoordinates = () => {
	const city = input.value || 'Wrocław';
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
		});
};

const getAirPollution = (lat, lon) => {
	const API_LINK2 = 'https://api.openweathermap.org/data/2.5/air_pollution?';
	fetch(API_LINK2 + lat + lon + API_KEY)
		.then(res => res.json())
		.then(data => {
			// pm10.textContent = data.list[0].components.pm10.toFixed(1) + ' uq/m3';
			// pm25.textContent = data.list[0].components.pm2_5.toFixed(1) + ' uq/m3';
			// co.textContent = data.list[0].components.co.toFixed(1) + ' uq/m3';
			// so2.textContent = data.list[0].components.so2.toFixed(1) + ' uq/m3';
			const myUnionsArr = [pm10, pm25, co, so2];
			const airComponent = data.list[0].components;
			const unionsArr = [airComponent.pm10, airComponent.pm2_5, airComponent.co, airComponent.so2];

			for (let i = 0; i < myUnionsArr.length; i++) {
				myUnionsArr[i].textContent = unionsArr[i].toFixed(1) + ' uq/m3';
			}
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
			if (data.list[0].components.co >= 9000) {
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
			if (input.value === '') {
				input.setAttribute('placeholder', 'Musisz podać nazwę miasta');
				cityName.textContent = 'WROCŁAW';
			} else {
				cityName.textContent = input.value.toUpperCase();
				input.setAttribute('placeholder', 'Podaj nazwę miasta');
				input.value = '';
				cityerror.textContent = '';
			}
			const kmPerH = (data.wind.speed * 3.6).toFixed(1);
			temp.textContent = data.main.temp.toFixed(1) + ' ℃';
			feel.textContent = data.main.feels_like.toFixed(1) + ' ℃';
			hum.textContent = data.main.humidity + ' %';
			wind.textContent = kmPerH + ' km/h';

			console.log(data.weather[0].icon);

			switch (data.weather[0].icon) {
				case '11d':
					weatherIcon.setAttribute('src', 'dist/img/thunderstorm.png');
					weatherWord.textContent = 'Burza';
					break;
				case '09d':
				case '10d':
				case '09n':
					weatherIcon.setAttribute('src', 'dist/img/rain.png');
					weatherWord.textContent = 'Deszczowo';
					break;
				case '13d':
					weatherIcon.setAttribute('src', 'dist/img/ice.png');
					weatherWord.textContent = 'Śnieg';
					break;
				case '50d':
					weatherIcon.setAttribute('src', 'dist/img/fog.png');
					weatherWord.textContent = 'Mgliście';
					break;
				case '01d':
					weatherIcon.setAttribute('src', 'dist/img/sun.png');
					weatherWord.textContent = 'Słonecznie';
					break;
				case '01n':
					weatherIcon.setAttribute('src', 'dist/img/moon.png');
					weatherWord.textContent = 'Bezchmurnie';
					break;
				case '02d':
				case '03d':
				case '04d':
					weatherIcon.setAttribute('src', 'dist/img/cloud.png');
					weatherWord.textContent = 'Pochmurno';
					break;
				case '02n':
				case '03n':
				case '04n':
					weatherIcon.setAttribute('src', 'dist/img/nightCloud.png');
					weatherWord.textContent = 'Pochmurno';
					break;
			}
		});
};

for (let i = 0; i < infoIcons.length; i++) {
	infoIcons[i].addEventListener('mouseenter', function () {
		infoCards[i].style.display = 'block';
	});
}

for (let i = 0; i < infoIcons.length; i++) {
	infoIcons[i].addEventListener('mouseleave', function () {
		infoCards[i].style.display = 'none';
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
