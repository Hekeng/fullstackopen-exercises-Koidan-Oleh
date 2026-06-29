import { useEffect, useState } from 'react'
import axiosServices from './services/axiosServices'
import Notification from './components/Notification'

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
          <button onClick={() => dellPerson(person)}>delete</button>
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

  const [message, setMessage] = useState({ message: null, messageType: null })

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
      if (window.confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        axiosServices
          .update(personId, newPerson)
          .then((response) => {

            let updatedPersons = persons.filter((item) => item.id != personId)
            updatedPersons = updatedPersons.concat(response)
            setPersons(updatedPersons)
            showMessage(`${newPerson.name} was updated!`, 'success')
			
          })
          .catch((error) => {
            showMessage(`Information about ${newPerson.name} has already been removed from the server.`, 'error')
          })
        setNewName('')
        setNewNumber('')
      } else {
        return
      }
    } else {
      axiosServices.create(newPerson).then((response) => {
        const newPersons = persons.concat(response)
        setPersons(newPersons)
        showMessage(`${newPerson.name} was created!`, 'success')
      })

      setNewName('')
      setNewNumber('')
    }
  }

  const checkRepeatedName = (personName) => {
    let elementId
    persons.forEach((element) => {
      if (element.name === personName) {
        elementId = element.id
      }
    })

    return elementId
  }

  const personsToShow = newSearch
    ? persons.filter((item) => item.name.toLowerCase().includes(newSearch.toLowerCase()))
    : persons

  const dellPerson = (person) => {
    if (window.confirm('Do you really want to delete this person?')) {
      const newPersons = persons.filter((item) => item.id != person.id)
      axiosServices
        .remove(person.id)
        .then(() => {
          setPersons(newPersons)
          showMessage(`Person ${person.name} successfully deleted!`, 'success')
        })
        .catch((error) => {
          showMessage(`Information about ${person.name} has already been removed from the server.`, 'error')
          setPersons(newPersons)
        })
    } else {
      showMessage(`Person ${person.name} deleting cancelled`, 'success')
    }
  }

  const showMessage = (mess, type) => {
    setMessage({ message: mess, messageType: type })

    setTimeout(() => {
      setMessage({ message: null, messageType: null })
    }, 5000)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message.message} messageType={message.messageType} />
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
