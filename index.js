const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('info', function(req, res) { 
  if (req.body.name) {
    return(JSON.stringify(req.body))
  }
})

app.use(express.static('build'))
app.use(express.json())
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.info(req, res),
    ].join(' ')
  })
)
app.use(cors())

let persons = [  
  {    
    id: 1,    
    name: "Arto Hellas",
    number: "040-123456"
  },
  {    
    id: 2,    
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {    
    id: 3,    
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {    
    id: 4,    
    name: "Mary Poppendick",
    number: "39-23-6423122"
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people.<br/>${new Date()}</p>`
  )
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const newId = () => {
  return (
    Math.floor(Math.random() * Math.floor(250))
  )
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name||!body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  } else if (persons.filter(person => person.name === body.name).length > 0) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  const person = {
    id: newId(),
    name: body.name,
    number: body.number
  }
  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})