import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/'

const getAll = () => {
  const request = axios.get(baseUrl + 'api/all')
  console.log(request)

  return request.then((response) => response.data)
}

// const create = (newObject) => {
//   const request = axios.post(baseUrl, newObject)
//   return request.then((response) => response.data)
// }

// const update = (id, newObject) => {
//   const request = axios.put(`${baseUrl}/${id}`, newObject)
//   return request.then((response) => response.data)
// }

// const remove = (id) => {
//   const request = axios.delete(`${baseUrl}/${id}`)
//   console.log('request :', request)

//   return request.then((response) => response.data)
// }

export default {
  getAll,
  // , create, update, remove
}
