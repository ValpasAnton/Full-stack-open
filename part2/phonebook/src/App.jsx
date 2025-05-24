import { useState, useEffect } from 'react'
import Filter from './components/Filter.jsx'
import PersonForm from './components/PersonForm.jsx'
import Personlist from './components/Personlist.jsx'
import axios from 'axios'
import numberService from './services/phonenumbers.js'
import Notification from './components/Notification.jsx'
import './index.css'
 
const App = () => {
  const [persons, setPersons] = useState([])
  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])


  const [newName, setNewName] = useState('')
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const [newNumber, setNewNumber] = useState('')
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  
	const [filter, setFilter] = useState('')
	const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const [notification, setNotification] = useState({ message: null, type: null })


  const addContact = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === newName)
        const updatedContact = {...person, number: newNumber}
        numberService.update(person.id, updatedContact)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
          setNotification({message:`Phonenumber of ${returnedPerson.name} has been changed`, type: 'added'})
          setTimeout(() => {
            setNotification({ message: null, type: null })
          }, 5000)
        })
        .catch(error => {
          setNotification({message: `Information of ${person.name} has already been removed from the server`, type: 'error'})
          setTimeout(() => {
            setNotification({ message: null, type: null })
          }, 5000)
          numberService
          .getAll()
          .then(data => setPersons(data))
          .catch(err => console.error('Failed to refresh persons:', err))

        })
      }
    } else {
      const newPerson = { name: newName, number: newNumber}
      numberService.create(newPerson).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson))
        setNotification({message: `${returnedPerson.name} has been added`, type: 'added'})
        setTimeout(() => {
          setNotification({ message: null, type: null })
        }, 5000)
        })
    }
  setNewName('')
  setNewNumber('')
  }
  const handleRemoval = (person) => {
      if (window.confirm(`Delete ${person.name}?`)) {
        numberService.remove(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id))
          })
          .catch(error => {
          alert(`The person ${person.name} was already deleted from the server.`)
          setPersons(persons.filter(p => p.id !== person.id))
          })
      }
    }

  const filtered = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification.message} type={notification.type}/>
      <Filter filter={filter} handleFilterChange={handleFilterChange}></Filter>
      <PersonForm addContact={addContact} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <Personlist personList = {filtered} onDelete={handleRemoval} />
    </div>
  )
}

export default App