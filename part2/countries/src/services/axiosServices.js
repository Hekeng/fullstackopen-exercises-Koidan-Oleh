import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/'

const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q='


const getAll = () => {
  const request = axios.get(baseUrl + 'api/all')
  return request.then((response) => response.data)
}

const getWeather = (weatherKey, city) => {
  const request = axios.get(`${weatherUrl}${city}&units=metric&appid=${weatherKey}`)
  return request.then((response) => response.data)
}


export default {
  getAll,
  getWeather,
}
