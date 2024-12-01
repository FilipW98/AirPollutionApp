import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import InfoTooltip from '@/components/ui/InfoTooltip';

const API_KEY = 'b005763a5f5701376b641f6d866e7e64';
const GEO_API = 'https://api.openweathermap.org/geo/1.0/direct';
const POLLUTION_API = 'https://api.openweathermap.org/data/2.5/air_pollution';
const WEATHER_API = 'https://api.openweathermap.org/data/2.5/weather';

const pollutantInfo = [
	{
		pollutant: 'pm10',
		description:
			'PM10 to cząstki stałe o średnicy mniejszej niż 10 mikrometrów. Pochodzą głównie z procesów spalania, przemysłu i ruchu drogowego. Mogą powodować problemy oddechowe.',
	},
	{
		pollutant: 'pm25',
		description:
			'PM2.5 to bardzo drobne cząstki o średnicy mniejszej niż 2.5 mikrometra. Są szczególnie niebezpieczne, gdyż mogą przedostawać się głęboko do płuc i układu krwionośnego.',
	},
	{
		pollutant: 'co',
		description:
			'CO (tlenek węgla) to bezwonny, trujący gaz powstający podczas niepełnego spalania. Może powodować bóle głowy, zawroty i problemy z oddychaniem.',
	},
	{
		pollutant: 'so2',
		description:
			'SO2 (dwutlenek siarki) to drażniący gaz o ostrym zapachu. Powstaje głównie podczas spalania paliw kopalnych. Może powodować problemy oddechowe i zaostrzać astmę.',
	},
];

const AirQualityMonitor = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [cityName, setCityName] = useState('');
	const [error, setError] = useState('');
	const [data, setData] = useState({
		pm10: 0,
		pm25: 0,
		co: 0,
		so2: 0,
		temp: 0,
		feelsLike: 0,
		wind: 0,
		humidity: 0,
		aqi: 1,
	});


const fetchData = async city => {
	try {
		const geoResponse = await fetch(`${GEO_API}?q=${encodeURIComponent(city)}&appid=${API_KEY}`);
		const geoData = await geoResponse.json();

		if (!geoData || !geoData[0] || !geoData[0].lat || !geoData[0].lon) {
			setError('Miasto nie znalezione');
			return;
		}

		const polishName = geoData[0].local_names?.pl;
		const apiCityName = (polishName || geoData[0].name || '').toLowerCase();
		const userInput = city.toLowerCase();

		if (!apiCityName || apiCityName !== userInput) {
			setError('Miasto nie znalezione');
			return;
		}


		const { lat, lon } = geoData[0];

		const pollutionResponse = await fetch(`${POLLUTION_API}?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
		const pollutionData = await pollutionResponse.json();

		const weatherResponse = await fetch(`${WEATHER_API}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
		const weatherData = await weatherResponse.json();

		const components = pollutionData.list[0]?.components || {};
		const weather = weatherData.main || {};

		setData({
			pm10: components.pm10 ? components.pm10.toFixed(1) : 'Brak danych',
			pm25: components.pm2_5 ? components.pm2_5.toFixed(1) : 'Brak danych',
			co: components.co ? components.co.toFixed(1) : 'Brak danych',
			so2: components.so2 ? components.so2.toFixed(1) : 'Brak danych',
			temp: weather.temp ? weather.temp.toFixed(1) : 'Brak danych',
			feelsLike: weather.feels_like ? weather.feels_like.toFixed(1) : 'Brak danych',
			wind: weatherData.wind?.speed ? (weatherData.wind.speed * 3.6).toFixed(1) : 'Brak danych',
			humidity: weather.humidity || 'Brak danych',
			aqi: pollutionData.list[0]?.main.aqi || 1,
		});


		setCityName(polishName?.toUpperCase() || geoData[0].name.toUpperCase());
		setError('');
		setSearchQuery('');
	} catch (err) {
		setError('Wystąpił błąd podczas pobierania danych');
	}
};


	useEffect(() => {
		fetchData('Warszawa');
	}, []);

	const handleSearch = e => {
		e.preventDefault();
		if (searchQuery.trim()) {
			fetchData(searchQuery);
		}
	};

	const getQualityStatus = (value, type) => {
		switch (type) {
			case 'pm25':
				return value < 10 ? 'Dobra' : 'Zła';
			case 'pm10':
				return value < 20 ? 'Dobra' : 'Zła';
			case 'co':
				return value < 9000 ? 'Dobra' : 'Zła';
			case 'so2':
				return value < 125 ? 'Dobra' : 'Zła';
			default:
				return 'Dobra';
		}
	};

	const getAqiStatus = aqi => {
		switch (aqi) {
			case 1:
				return { text: 'Dobra', color: 'text-green-400' };
			case 2:
				return { text: 'Umiarkowana', color: 'text-yellow-400' };
			default:
				return { text: 'Zła', color: 'text-red-400' };
		}
	};


	return (
		<div className='app-box py-9 md:px-9 px-4'>
			<div className='w-full max-w-screen-lg mx-auto p-6 bg-slate-700 rounded-lg'>
				<h1 className='text-3xl font-bold text-white mb-6 text-center'>
					Air Pollution App
					{cityName && <div className='text-xl mt-2 text-slate-400'>{cityName}</div>}
				</h1>

				<form onSubmit={handleSearch} className='relative mb-8'>
					<input
						type='text'
						placeholder='Wpisz nazwę miasta...'
						className='w-full p-3 pr-12 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-blue-500'
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
					/>
					<button type='submit' className='absolute right-3 top-1/2 transform -translate-y-1/2'>
						<Search className='text-slate-400' />
					</button>
				</form>

				{error && <div className='text-red-500 text-center mb-4'>{error}</div>}

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
					<div>
						<h2 className='text-xl text-yellow-500 mb-4 flex items-center gap-2'>
							<span className='text-2xl'>⚠</span> Jakość Powietrza
						</h2>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<Card className={`bg-slate-800 border-slate-700 ${data.pm10 >= 20 ? 'bg-red-900/50' : ''}`}>
								<CardContent className='p-5'>
									<div className='flex justify-between items-start mb-2 lg:text-xl '>
										<span className='text-slate-400'>PM10</span>

										<InfoTooltip pollutantType='pm10' pollutantInfo={pollutantInfo[0].description} />
									</div>
									<div className='text-xl font-bold text-white mb-1 md:text-xl  '>{data.pm10} µg/m³</div>
									<div
										className={
											data.pm10 >= 20
												? 'text-red-400 md:text-lg lg:text-base'
												: 'text-green-400 md:text-lg lg:text-base'
										}
									>
										{getQualityStatus(data.pm10, 'pm10')}
									</div>
								</CardContent>
							</Card>

							<Card className={`bg-slate-800 border-slate-700 ${data.pm25 >= 10 ? 'bg-red-900/50' : ''}`}>
								<CardContent className='p-5'>
									<div className='flex justify-between items-start mb-2 lg:text-xl '>
										<span className='text-slate-400'>PM2.5</span>
										<InfoTooltip pollutantType='pm25' pollutantInfo={pollutantInfo[1].description} />
									</div>
									<div className='text-xl font-bold text-white mb-1'>{data.pm25} µg/m³</div>
									<div
										className={
											data.pm25 >= 10
												? 'text-red-400  md:text-lg lg:text-base'
												: 'text-green-400 md:text-lg lg:text-base'
										}
									>
										{getQualityStatus(data.pm25, 'pm25')}
									</div>
								</CardContent>
							</Card>

							<Card className={`bg-slate-800 border-slate-700 ${data.co >= 9000 ? 'bg-red-900/50' : ''}`}>
								<CardContent className='p-5'>
									<div className='flex justify-between items-start mb-2 lg:text-xl '>
										<span className='text-slate-400'>CO</span>
										<InfoTooltip pollutantType='CO' pollutantInfo={pollutantInfo[2].description} />
									</div>
									<div className='text-xl font-bold text-white mb-1'>{data.co} µg/m³</div>
									<div
										className={
											data.co >= 9000
												? 'text-red-400  md:text-lg lg:text-base'
												: 'text-green-400  md:text-lg lg:text-base'
										}
									>
										{getQualityStatus(data.co, 'co')}
									</div>
								</CardContent>
							</Card>

							<Card className={`bg-slate-800 border-slate-700 ${data.so2 >= 125 ? 'bg-red-900/50' : ''}`}>
								<CardContent className='p-5'>
									<div className='flex justify-between items-start mb-2 lg:text-xl '>
										<span className='text-slate-400'>SO2</span>
										<InfoTooltip pollutantType='SO2' pollutantInfo={pollutantInfo[3].description} />
									</div>
									<div className='text-xl font-bold text-white mb-1'>{data.so2} µg/m³</div>
									<div
										className={
											data.so2 >= 125
												? 'text-red-400  md:text-lg lg:text-base'
												: 'text-green-400  md:text-lg lg:text-base'
										}
									>
										{getQualityStatus(data.so2, 'so2')}
									</div>
								</CardContent>
							</Card>
						</div>
					</div>

					<div>
						<h2 className='text-xl text-blue-300 mb-4 flex items-center gap-2'>
							<span className='text-2xl'>🌥</span> Warunki Pogodowe
						</h2>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<Card className='bg-slate-800 border-slate-700'>
								<CardContent className='p-5'>
									<div className='text-slate-400 mb-2 lg:text-xl '>Temperatura</div>
									<div className='text-xl font-bold text-white mb-1'>{data.temp}°C</div>
									<div className='text-slate-400  md:text-lg lg:text-base'>Odczuwalna: {data.feelsLike}°C</div>
								</CardContent>
							</Card>

							<Card className='bg-slate-800 border-slate-700'>
								<CardContent className='p-5'>
									<div className='text-slate-400 mb-2 lg:text-xl '>Wiatr</div>
									<div className='text-xl font-bold text-white mb-1'>{data.wind} km/h</div>
									<div className='text-slate-400  md:text-lg lg:text-base'>Płn-Wsch</div>
								</CardContent>
							</Card>

							<Card className='bg-slate-800 border-slate-700'>
								<CardContent className='p-5'>
									<div className='text-slate-400 mb-2 lg:text-xl '>Wilgotność</div>
									<div className='text-xl font-bold text-white mb-1'>{data.humidity}%</div>
									<div className='text-slate-400  md:text-lg lg:text-base'>
										{data.humidity < 30 ? 'Niska' : data.humidity > 70 ? 'Wysoka' : 'Umiarkowana'}
									</div>
								</CardContent>
							</Card>

							<Card className='bg-slate-800 border-slate-700'>
								<CardContent className='p-5'>
									<div className='text-slate-400 mb-2 lg:text-xl '>Jakość Powietrza</div>
									<div className='text-xl font-bold text-white mb-1 '>{getAqiStatus(data.aqi).text}</div>
									<div className={`${getAqiStatus(data.aqi).color}  md:text-lg lg:text-base `}>
										{data.aqi === 1 ? 'Można ćwiczyć' : 'Ogranicz aktywność'}
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AirQualityMonitor;
