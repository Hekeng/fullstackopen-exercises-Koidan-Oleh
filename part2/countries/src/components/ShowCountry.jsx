import { useEffect, useState } from 'react'
import axiosServices from '../services/axiosServices'

export const ShowCountry = ({ country }) => {
  const weatherKey = import.meta.env.VITE_WEATHER_KEY
  const capital = country.capital ? country.capital[0] : 'No capital'

  const [weather, setWeather] = useState(null)

  useEffect(() => {
    axiosServices.getWeather(weatherKey, capital).then((response) => {
      setWeather(response)
    })
  }, [capital])
  return (
    <>
      <div key={country.name.common}>
        <h1>{country.name.common}</h1>
        <p>Capital: {capital}</p>
        <p>Area: {country.area} m2</p>
        <h2>Languages:</h2>
        <ul>
          {Object.values(country.languages).map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <h2>Flag : </h2>
        <img className="flag" src={country.flags.svg} alt={country.flags.alt} />

        {weather ? (
          <>
            <h2>Weather in {capital}</h2>
            <p>Temperature {weather.main.temp} Celcius</p>
            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
            <p>Wind {weather.wind.speed} m/s</p>
          </>
        ) : (
          <p>Weather is dowloding</p>
        )}
      </div>
    </>
  )
}
