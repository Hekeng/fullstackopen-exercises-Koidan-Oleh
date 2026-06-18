import { useEffect, useState } from 'react'
import axios from 'axios'
import axiosServices from './services/axiosServises'

const Filter = ({ newSearch, handleSetSearch }) => {
  return (
    <div>
      filter shown with <input value={newSearch} onChange={handleSetSearch} />
    </div>
  )
}

const PersonForm = ({ handleSetNewName, newName, handleNameChange, newNumber, handleTelChange }) => {
  return (
    <form onSubmit={handleSetNewName}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
        <div>
          number: <input value={newNumber} onChange={handleTelChange} />
        </div>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ personsToShow, dellPerson }) => {
  return (
    <>
      {personsToShow.map((person) => (
        <div key={person.id}>
          <span>
            {person.name} {person.number}
          </span>
          <button onClick={() => dellPerson(person.id)}>delete</button>
        </div>
      ))}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setSearch] = useState('')

  useEffect(() => {
    axiosServices.getAll().then((response) => {
      setPersons(response)
    })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleTelChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSetSearch = (event) => {
    setSearch(event.target.value)
  }

  const handleSetNewName = (event) => {
    event.preventDefault()

    const newPerson = {
      name: newName,
      number: newNumber,
    }

    const personId = checkRepeatedName(newPerson.name)

    if (personId) {
      if (window.confirm(`${newPerson.name} is already adddet to phonebook, replace the old number with a new one?`)) {
        axiosServices.update(personId, newPerson).then((response) => {
          let updatedPersons = persons.filter((item) => item.id != personId)

          updatedPersons = updatedPersons.concat(response)

          setPersons(updatedPersons)
        })
        setNewName('')
        setNewNumber('')
        console.log(`persons updated`)
      } else {
        return
      }
    } else {
      axiosServices.create(newPerson).then((response) => {
        const newPersons = persons.concat(response)
        setPersons(newPersons)
      })

      setNewName('')
      setNewNumber('')
    }
  }

  const checkRepeatedName = (person) => {
    let elementId

    persons.forEach((element) => {
      if (element.name === person) {
        elementId = element.id
      }
    })

    return elementId
  }

  const personsToShow = newSearch
    ? persons.filter((item) => item.name.toLowerCase().includes(newSearch.toLowerCase()))
    : persons

  const dellPerson = (id) => {
    if (window.confirm('Do you really want to delete this person?')) {
      axiosServices.remove(id).then(() => {
        const newPersons = persons.filter((item) => item.id != id)
        setPersons(newPersons)
      })
      console.log(`delete`)
    } else {
      console.log('delete cancellation')
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newSearch={newSearch} handleSetSearch={handleSetSearch} />

      <h3>Add a new</h3>
      <PersonForm
        handleSetNewName={handleSetNewName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleTelChange={handleTelChange}
      />

      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} dellPerson={dellPerson} />
    </div>
  )
}

export default App
