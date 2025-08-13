'use client';

import { useState, useEffect } from "react";

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  // Fetch weather by city name
  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();
      setWeather(data);
      setError("");
      await fetchForecast(cityName);
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch forecast data
  const fetchForecast = async (cityName) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      setForecast(data.list.slice(0, 8)); // First 8 entries (~24 hours)
    } catch (err) {
      console.error("Forecast fetch error:", err);
    }
  };

  // Get weather based on user location
  const getLocationWeather = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          setLoading(true);
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          const data = await res.json();
          setWeather(data);
          setError("");
          await fetchForecast(data.name);
        } catch (err) {
          setError("Unable to fetch location weather");
        } finally {
          setLoading(false);
        }
      },
      () => setError("Location access denied")
    );
  };

  // Auto-get location weather on load
  useEffect(() => {
    getLocationWeather();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-4xl font-bold mb-6">Weather App</h1>

      {/* Search Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-2 rounded-lg text-black w-64"
        />
        <button
          onClick={() => fetchWeather(city)}
          className="bg-yellow-400 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500"
        >
          Get Weather
        </button>
      </div>

      {/* Loading */}
      {loading && <p className="text-lg animate-pulse">Loading...</p>}

      {/* Error */}
      {error && <p className="text-red-300">{error}</p>}

      {/* Current Weather */}
      {weather && !loading && (
        <div className="bg-white text-black p-6 rounded-lg shadow-lg text-center w-72 mb-6">
          <h2 className="text-2xl font-bold">{weather.name}</h2>
          <p className="text-xl font-semibold">{Math.round(weather.main.temp)}°C</p>
          <p className="capitalize text-gray-700">{weather.weather[0].description}</p>
          <p className="mt-2 text-sm text-gray-500">Humidity: {weather.main.humidity}%</p>
          <p className="text-sm text-gray-500">Wind Speed: {weather.wind.speed} m/s</p>
        </div>
      )}

      {/* Forecast */}
      {forecast.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {forecast.map((f, i) => (
            <div key={i} className="bg-white p-4 rounded-lg text-black text-center">
              <p className="font-semibold">
                {new Date(f.dt * 1000).toLocaleDateString("en-US", {
                  weekday: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-lg font-bold">{Math.round(f.main.temp)}°C</p>
              <p className="capitalize">{f.weather[0].description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
