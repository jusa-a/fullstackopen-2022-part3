const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())

morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ' '
})

app.use(
    morgan(
        ':method :url :status :res[content-length] - :response-time ms :body'
    )
)

let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456',
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523',
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345',
    },
    {
        id: 4,
        name: 'Mary Poppendieck',
        number: '39-23-6423122',
    },
]

app.get('/info', (request, response) => {
    const personCount = persons.length
    const date = new Date()
    response.send(
        `<div>Phonebook has info for ${personCount} people</div>
        <div>${date}</div>`
    )
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find((p) => p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter((p) => p.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const name = request.body.name
    const number = request.body.number

    if (!name || !number) {
        return response.status(400).json({
            error: 'name or number missing',
        })
    }

    if (persons.some((p) => p.name === name)) {
        return response.status(400).json({
            error: 'name must be unique',
        })
    }

    if (persons.some((p) => p.number === number)) {
        return response.status(400).json({
            error: 'number must be unique',
        })
    }

    const person = {
        id: Math.floor(Math.random() * 10000),
        name: name,
        number: number,
    }

    persons = persons.concat(person)

    response.json(person)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
