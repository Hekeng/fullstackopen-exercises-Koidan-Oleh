import { useState } from 'react'

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

const Persons = ({ personsToShow }) => {
  return (
    <>
      {personsToShow.map((person) => (
        <p key={person.id}>
          {person.name} {person.number}
        </p>
      ))}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setSearch] = useState('')

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
      id: persons.length + 1,
    }

    if (checkRepeatedName(newPerson.name)) {
      return
    } else {
      setPersons(persons.concat(newPerson))
      setNewName('')
      setNewNumber('')
    }
  }

  const checkRepeatedName = (person) => {
    const hasMatch = persons.some((element) => element.name === person)

    if (hasMatch) {
      alert(`${person} is already added to phonebook`)
    }

    return hasMatch
  }

  const personsToShow = newSearch
    ? persons.filter((item) => item.name.toLowerCase().includes(newSearch.toLowerCase()))
    : persons

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
      <Persons personsToShow={personsToShow} />
    </div>
  )
}

export default App
