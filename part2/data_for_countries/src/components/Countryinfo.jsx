import React from "react";
import axios from 'axios';
import { useState, useEffect } from "react";

const Countryinfo = ({country, back}) => {
    if (!country || !country.name) return null;

    const [weather, setWeather] = useState(null)
    const api_key = import.meta.env.VITE_SOME_KEY;

    useEffect(() => {
        const source = `https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&units=metric&appid=${api_key}`
        console.log("Fetching weather for", country.capital);
        axios.get(source)
          .then(response => {
            setWeather(response.data)
          })
          .catch(error => {
            console.error("Failed to fetch weather data:", error)
          })
      }, [country.capital, api_key])

    useEffect(() => {
        console.log("Rendering country:", country);
    }, [country]);
    return (
        <div>
            <button onClick={back}>back</button>
            <h1>{country.name.common}</h1>
            <p>Capital: {country.capital}</p>
            <p>Area: {country.area} km^2</p>
            <h2>Languages</h2>
            <ul>
                {Object.entries(country.languages).map(([code, language]) => <li key={code}>{language}</li>)}
            </ul>
            <img src={country.flags.png}></img>
            {weather && (
                <>
                    <h1>Live weather in {country.capital}</h1>
                    <p>Temperature: {weather.main.temp} °C</p>
                    <img
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                        alt={weather.weather[0].description}
                    />
                    <p>Wind: {weather.wind.speed} m/s</p>
                </>
            )}
        </div>
        
    )
}
export default Countryinfo;