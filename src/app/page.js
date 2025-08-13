'use client';

import { useState } from "react";

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = "5e9b9c894393247182f9cf4647348f15";

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name");
      setWeather(null);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();
      setWeather(data);
      setError("");
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-4xl font-bold mb-6">Weather App</h1>

      {/* Input & Button */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-2 rounded-lg text-black w-64"
        />
        <button
          onClick={fetchWeather}
          className="bg-yellow-400 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500"
        >
          Get Weather
        </button>
      </div>

      {/* Loading */}
      {loading && <p className="text-lg animate-pulse">Loading...</p>}

      {/* Error */}
      {error && <p className="text-red-300">{error}</p>}

      {/* Weather Data */}
      {weather && !loading && (
        <div className="bg-white text-black p-6 rounded-lg shadow-lg text-center w-72">
          <h2 className="text-2xl font-bold">{weather.name}</h2>
          <p className="text-xl font-semibold">{Math.round(weather.main.temp)}°C</p>
          <p className="capitalize text-gray-700">{weather.weather[0].description}</p>
          <p className="mt-2 text-sm text-gray-500">Humidity: {weather.main.humidity}%</p>
          <p className="text-sm text-gray-500">Wind Speed: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}
