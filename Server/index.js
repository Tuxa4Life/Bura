const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const cors = require('cors')
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
    cors: { origin: "*" }
})

server.listen(3001, () => {
    console.log('Sever is running on port: 3001')
})

io.on('connection', socket => {
    console.log('instance connected: ', socket.id)
})