import { useState } from 'react'
//npm run dev -- --host 0.0.0.0
const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
  ])
  const [newName, setNewName] = useState('')
  const [newPhone, setnewPhone] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleTellChenge = (event) => {
    setnewPhone(event.target.value)
  }

  const handleSetNewName = (event) => {
    event.preventDefault()

    const newPerson = {
      name: newName,
      phone: newPhone,
      id: persons.length + 1,
    }

    if (checkRepeatedName(newPerson.name) === true) {
      return
    } else {
      setPersons(persons.concat(newPerson))
      setNewName('')
    }
  }

  const checkRepeatedName = (person) => {
    const hasMatch = persons.some((element) => element.name === person)

    if (hasMatch) {
      alert(`${person} is already added to phonebook`)
    }

    return hasMatch
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with <input />
      </div>

      <h2>add a new</h2>
      <form onSubmit={handleSetNewName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
          <div>
            number: <input value={newPhone} onChange={handleTellChenge} />
          </div>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      {persons.map((person) => (
        <p key={person.id}>
          {person.name} {person.phone}
        </p>
      ))}
    </div>
  )
}

export default App
