import { useEffect, useState } from 'react'
import axiosServices from './services/axiosServices'
import { List } from './components/List'

const APP = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCoutry, setSelectedCoutry] = useState()

  useEffect(() => {
    axiosServices.getAll().then((response) => {
      setCountries(response)
    })
  }, [])

  const handleSetSearch = (event) => {
    setSearch(event.target.value)
  }

  const serchCountry = () => {
    const filtretList = countries.filter((item) => item.name.common.toLowerCase().includes(search.toLowerCase()))
    return filtretList
  }

   return (
    <>
      find countries{' '}
      <input
        value={search}
        onChange={(event) => {
          handleSetSearch(event)
          setSelectedCoutry()
        }}
      />
      <List countries={serchCountry()} selectedCoutry={selectedCoutry} setSelectedCoutry={setSelectedCoutry} />
    </>
  )
}

export default APP
