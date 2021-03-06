
//https://openweathermap.org/current
//https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily
//https://openweathermap.org/img/w/ .png

// Creación de variables y constantes que se usarán para fechas, objetos y requests
const Http = new XMLHttpRequest();
const token = 'b21b99d30bc0a333500d3e638ea4409f';
const mainUrl = 'https://api.openweathermap.org/data/2.5/';
let bogotaData = {};
let parisData = {};
const fecha = new Date();
const hoy = fecha.getDate();
const mes = fecha.getMonth(); 
const year = fecha.getFullYear();
const tomorrow = new Date();
const segundodia = new Date();
const tercerdia = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
segundodia.setDate(segundodia.getDate() + 2);
tercerdia.setDate(tercerdia.getDate() + 3);
document.getElementById('main-city-date').innerHTML = fecha.toDateString();
document.getElementById('main-forecast-date0').innerHTML = tomorrow.toDateString();
document.getElementById('main-forecast-date1').innerHTML = segundodia.toDateString();
document.getElementById('main-forecast-date2').innerHTML = tercerdia.toDateString();

// Función de solicitud de datos a la API
const getData = (query,type) => {
    const url = `${mainUrl}${type}?${query}&appid=${token}`;
    Http.open("GET", url);
    Http.send();
};
// Solicitud de datos de la ciudad secundaria
const setData = (data) => {
    const { lat, lon } = data;
    const query = `&lat=${lat}&lon=${lon}&exclude=hourly,current,minutely,alerts`;
    if (data.name === 'Bogota') {
        bogotaData = data;
        getData(query, 'onecall');
    } else {
        const imagen = document.createElement('img');
        parisData = data;
        document.getElementById('secondary-city-name').innerHTML = `${parisData.name}`;
        document.getElementById('secondary-city-temp').innerHTML = `${Math.round(parisData.temp-273.15)} °C`;
        imagen.src = parisData.icon;
        if (document.getElementById('secondary-city-weather').innerHTML.length === 0) document.getElementById('secondary-city-weather').appendChild(imagen);
    }
};
// Solicitud de datos a la API de la ciudad principal
Http.onreadystatechange = (e) => {
    const response = Http.response;
    if (response !== "" && JSON.parse(response).name) {
        const { coord, name, main, weather } = JSON.parse(response);
        const data = {
            lat: coord.lat,
            lon: coord.lon,
            name,
            temp: main.temp,
            weather,
            icon: `https://openweathermap.org/img/w/${weather[0].icon}.png`
        }
        setData(data);
        return;
    } else if (response !== "" && JSON.parse(response).daily) {
        const { lat, lon, daily } = JSON.parse(response);
        if (lat === bogotaData.lat && lon === bogotaData.lon) {
            // Creación de elementos img para los íconos
            const imagenPrincipal = document.createElement('img');
            const imagenForecast0 = document.createElement('img');
            const imagenForecast1 = document.createElement('img');
            const imagenForecast2 = document.createElement('img');
            const iconURL = "https://openweathermap.org/img/w/"
            const ext = ".png"
            bogotaData = {
            ...bogotaData,
            daily,
            }
            // Solicitud de temperatura y nombre de la ciudad principal
            const forecastdaytemp0 = Math.round(((bogotaData.daily[0].temp.max + bogotaData.daily[0].temp.min) / 2)-273.15);
            const forecastdaytemp1 = Math.round(((bogotaData.daily[1].temp.max + bogotaData.daily[1].temp.min) / 2)-273.15);
            const forecastdaytemp2 = Math.round(((bogotaData.daily[2].temp.max + bogotaData.daily[2].temp.min) / 2)-273.15);
            document.getElementById('main-forecast-day0').innerHTML = `${forecastdaytemp0} °C`;
            document.getElementById('main-forecast-descr0').innerHTML = `${bogotaData.daily[0].weather[0].main}`;
            document.getElementById('main-forecast-day1').innerHTML = `${forecastdaytemp1}  °C`;
            document.getElementById('main-forecast-descr1').innerHTML = `${bogotaData.daily[1].weather[0].main}`;
            document.getElementById('main-forecast-day2').innerHTML = `${forecastdaytemp2}  °C`;
            document.getElementById('main-forecast-descr2').innerHTML = `${bogotaData.daily[2].weather[0].main}`;
            document.getElementById('main-city-name').innerHTML = `${bogotaData.name}`;
            document.getElementById('main-city-temp').innerHTML = `${Math.round(bogotaData.temp-273.15)} °C`;
            console.log(bogotaData.daily);
            // Solicitud de iconos
            imagenPrincipal.src = bogotaData.icon;
            imagenForecast0.src = iconURL+bogotaData.daily[0].weather[0].icon+ext;
            imagenForecast1.src = iconURL+bogotaData.daily[1].weather[0].icon+ext;
            imagenForecast2.src = iconURL+bogotaData.daily[2].weather[0].icon+ext;
            document.getElementById('main-city-weather').appendChild(imagenPrincipal);
            document.getElementById('main-forecast-day0').appendChild(imagenForecast0);
            document.getElementById('main-forecast-day1').appendChild(imagenForecast1);
            document.getElementById('main-forecast-day2').appendChild(imagenForecast2);
            getData('q=Paris', 'weather');
            return;
        }
    }
    return;
}

getData('q=Bogota', 'weather');

