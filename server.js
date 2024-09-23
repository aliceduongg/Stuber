const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

app.use(express.json())

const users = []

app.get('/users', (req, res) => {
  console.log('GET /users request received')
  res.json(users)
})

app.post('/users', async (req, res) => {
  console.log('POST /users request received', req.body)
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = { name: req.body.name, password: hashedPassword }
    users.push(user)
    console.log('User created successfully')
    res.status(201).json({ message: 'User created successfully', statusCode: 201 })
  } catch (error) {
    console.error('Error in POST /users:', error)
    res.status(500).json({ message: 'Internal server error', statusCode: 500 })
  }
})

app.post('/users/login', async (req, res) => {
  console.log('POST /users/login request received', req.body)
  const user = users.find(user => user.name === req.body.name)
  if (user == null) {
    console.log('User not found')
    return res.status(400).json({ message: 'Cannot find user', statusCode: 400 })
  }
  try {
    if(await bcrypt.compare(req.body.password, user.password)) {
      console.log('Login successful')
      res.status(200).json({ message: 'Login successful', statusCode: 200 })
    } else {
      console.log('Login failed - incorrect password')
      res.status(401).json({ message: 'Not Allowed', statusCode: 401 })
    }
  } catch (error) {
    console.error('Error in POST /users/login:', error)
    res.status(500).json({ message: 'Internal server error', statusCode: 500 })
  }
})

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})