// 🌧️ RAIN
function createRain() {
const rain = document.getElementById("rain");

for (let i = 0; i < 120; i++) {
const drop = document.createElement("div");
drop.classList.add("drop");

drop.style.left = Math.random() * 100 + "vw";
drop.style.animationDuration = 0.5 + Math.random() * 0.7 + "s";

rain.appendChild(drop);
}
}
createRain();

// 🌙 DARK MODE
function toggleDark(){
document.body.classList.toggle("dark");
}

// ⚡ LIGHTNING
function lightningEffect(){
const flash = document.getElementById("flash");
const sound = document.getElementById("thunder");

flash.classList.add("flash");
sound.play();

setTimeout(()=> flash.classList.remove("flash"),200);
}

// ☀️ SUN POSITION
function updateSunPosition(sunrise, sunset) {
const sun = document.getElementById("sun");

const now = Date.now();
const rise = new Date(sunrise).getTime();
const set = new Date(sunset).getTime();

if (now < rise || now > set) {
document.body.classList.add("night");
return;
}

document.body.classList.remove("night");

const progress = (now - rise) / (set - rise);

const x = 10 + progress * 80;
const y = 80 - Math.sin(progress * Math.PI) * 60;

sun.style.left = x + "%";
sun.style.top = y + "%";
}

// 🌤️ FETCH WEATHER
async function fetchWeather(lat, lon, name="Location") {
const res = await fetch(
`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=sunrise,sunset&timezone=auto`
);

const data = await res.json();
const code = data.current.weather_code;

document.getElementById("city").innerText = name;
document.getElementById("temp").innerText = data.current.temperature_2m + "°C";
document.getElementById("humidity").innerText = data.current.relative_humidity_2m + "%";
document.getElementById("wind").innerText = data.current.wind_speed_10m + " km/h";

document.getElementById("icon").innerText = getIcon(code);
document.getElementById("desc").innerText = getDesc(code);

// 🌅 SUN UPDATE
updateSunPosition(
data.daily.sunrise[0],
data.daily.sunset[0]
);

// ⚡ thunderstorm
if (code >= 95) lightningEffect();

// 🌈 background
setBackground(code);
}

// 🌍 SEARCH
async function getWeather() {
const city = document.getElementById("cityInput").value;

const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
const data = await geo.json();

if (!data.results) return alert("City not found");

const { latitude, longitude, name } = data.results[0];

fetchWeather(latitude, longitude, name);
}

// 📍 GPS
function getLocationWeather() {
navigator.geolocation.getCurrentPosition(pos => {
fetchWeather(pos.coords.latitude, pos.coords.longitude, "Your Location");
});
}

// 🌈 BACKGROUND
function setBackground(code){
const bg = document.getElementById("bg");

if (code === 0)
bg.style.background = "linear-gradient(-45deg,#56ccf2,#2f80ed)";
else if (code <= 2)
bg.style.background = "linear-gradient(-45deg,#89f7fe,#66a6ff)";
else if (code === 3)
bg.style.background = "linear-gradient(-45deg,#bdc3c7,#2c3e50)";
else if (code >= 61)
bg.style.background = "linear-gradient(-45deg,#4e54c8,#8f94fb)";
else if (code >= 95)
bg.style.background = "linear-gradient(-45deg,#0f0c29,#302b63,#24243e)";
}

// ICONS
function getIcon(c){
if (c===0) return "☀️";
if (c<=2) return "🌤️";
if (c===3) return "☁️";
if (c>=61) return "🌧️";
if (c>=95) return "⛈️";
return "🌍";
}

function getDesc(c){
if (c===0) return "Clear Sky";
if (c<=2) return "Partly Cloudy";
if (c===3) return "Cloudy";
if (c>=61) return "Rainy";
if (c>=95) return "Thunderstorm";
return "Unknown";
}