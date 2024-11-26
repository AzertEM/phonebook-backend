const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

let phonebook = [
    { 
      id: "1",
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: "2",
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: "3",
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: "4",
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

// Return a random number in [0 ..MAX]
const generateId = () => {
    const MAX = 100000
    return Math.floor(Math.random() * MAX)
}

app.get('/api/persons', (request, response) => {
    response.send(phonebook)
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    // Check content
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "Missing content (name and phone number)"
        })
    }
    
    // Check name duplicate 
    const index = phonebook.findIndex(person => person.name === body.name)
    if (index != -1) {
        return response.status(400).json({
            error: "Duplicate name"
        })
    }

    const person = {
        id: String(generateId()),
        name: body.name,
        number: body.number
    }

    phonebook = phonebook.concat(person)

    console.log(body)
    response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = phonebook.find(person => person.id === id)

    if (person) {
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    response.send(`<p>Currently there are ${phonebook.length} entries<\p>
                    <p>${Date()}<p>`)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    console.log(id)
    phonebook = phonebook.filter(person => person.id !== id)

    response.send(phonebook)
})


const PORT =  process.env.PORT | 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)