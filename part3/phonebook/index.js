const express = require('express')
const morgan = require('morgan')
const app = express()

let phonebook = [
    { 
        "id": "1",
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": "2",
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": "3",
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": "4",
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
  ]

app.use(express.json())
morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})
  
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const phone = phonebook.find((phone) => phone.id === id)
  
    if (phone) {
      response.json(phone)
    } else {
      response.status(404).end()
    }
})


app.get('/info', (request, response) => {
    const count = phonebook.length
    const time = new Date()
  
    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${time}</p>
    `)
  })
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    phonebook = phonebook.filter((phone) => phone.id !== id)
  
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  console.log('Headers:', request.headers)
  console.log('Body:', request.body)

  
  const body = request.body
  
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing',
    })
    }
  if (phonebook.some(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
    
  const newId = Math.floor(Math.random() * 1000000)

  const newPerson = {
    id: newId.toString(),  
    name: body.name,
    number: body.number
  }

  phonebook = phonebook.concat(newPerson)

  response.json(newPerson)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})