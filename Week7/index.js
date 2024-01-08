const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')
const session = require('express-session')

const initializePassport = require('./passport-config')
initializePassport(passport, getUserByUsername, getUserById)

function getUserById(id) {
    return users.find(user => user.id === id)
}

function getUserByUsername(username) {
    return users.find(user => user.username === username)
}

const app = express()

const port = 3000
let uid = 50000
let users = []

app.use(express.json())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.post('/api/user/register', async (req, res) => {
    if(req.isAuthenticated()){
        res.redirect('/')
    }
    else {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const filteredUsers = users.filter(user => user.username === req.body.username)
            if (filteredUsers.length === 0) {
                const user = {id: uid, username: req.body.username, password: hashedPassword}
                users.push(user)
                uid++
                res/* .status(201) */.send(user)
            }
            else {
                res.status(400).send(`User with username ${req.body.username} already exists`)
            }
        } catch {
            console.log('Something went wrong')
            res.status(500).send('Something went wrong')
        }
    }
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/api/user/login', passport.authenticate('local', {
    successRedirect: '/api/user/success',
}))

app.get('/api/user/success', (req, res) => {
    const sessionCookie = req.session.cookie;
    res.setHeader('set-cookie', [sessionCookie]).status(200).send('You have successfully logged in');
})

app.get("/api/secret", (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).send('You have successfully accessed the secret page')
    }
    else {
        res.status(401).send('You are not logged in')
    }
})

app.get('/api/user/list', (req, res) => {
    try {
        res.status(200).send(users)
    } catch {
        res.status(400).send('Something went wrong')
    }
})

todosList = []

app.post('/api/todos/list', (req, res) => {

    if(req.isAuthenticated()){
        correctTodoList = todosList.find(todos => todos.id === req.user.id)
        if(!correctTodoList){
            todosList.push({id: req.user.id, todos: [req.body.todo]})
            res.status(200).send({id: req.user.id, todos: [req.body.todo]})
        }
        else if (correctTodoList){
            let todo = todosList.find(todos => todos.id === correctTodoList.id)
            todo.todos.push(req.body.todo)
            res.status(200).send(todo)
        }
        else {
            console.log('Something went wrong')
        }
    } else {
        res.status(401).send('You are not logged in')
    }  
})

app.get('/api/todos/list', (req, res) => {
    res.send(todosList)
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})                         