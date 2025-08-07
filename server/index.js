const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const cors = require('cors')
const { shuffle, cards, dealCards, getWinnerIndex, countPoints } = require('./cards')

app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
    cors: { origin: '*' },
})

const games = {}

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})

io.on('connection', (socket) => {
    console.log('Client connected: ', socket.id)

    socket.on('join-room', async ({ name, roomId }) => {
        socket.join(roomId)

        if (!games[roomId]) {
            games[roomId] = {
                players: [],
                deck: [],
                trump: '',
                multiplier: 1,
                turn: 0,
                lastDavi: null,
            }
        }

        const game = games[roomId]
        if (!game.players.find((p) => p.id === socket.id)) {
            game.players.push({
                id: socket.id,
                name,
                hand: [],
                played: [],
                taken: [],
                points: 0,
            })
        }

        console.log(`${name} joined Room: ${roomId}`)
        io.in(roomId).emit('update-state', game)

        if (game.players.length === 4) {
            startGame(roomId)
        }
    })

    socket.on('player-played', ({ roomId, played }) => {
        const game = games[roomId]
        if (!game) {
            console.log(`Game with ID: ${roomId} cannot be found.`)
            return
        }

        const currentPlayer = game.players[game.turn]
        currentPlayer.played = played
        currentPlayer.hand = currentPlayer.hand.filter((card) => !played.includes(card))

        io.in(roomId).emit('update-state', game)

        const hasBura = played.every((card) => card === game.trump)
        if (hasBura) {
            handleBura(roomId)
            return
        }

        game.turn = (game.turn + 1) % 4

        const allPlayed = game.players.every((player) => player.played.length !== 0)
        if (!allPlayed) return

        const hands = []
        game.players.forEach((player) => {
            hands.push(player.played)
            player.played = []
        })

        const winnerIndex = getWinnerIndex(hands, game.trump)
        game.players[winnerIndex].taken.push([hands])
        game.turn = winnerIndex

        let i = winnerIndex
        while (game.deck.length > 0 && game.players.some((p) => p.hand.length < 5)) {
            game.players[i].hand.push(...dealCards(game.deck, 1))
            i = (i + 1) % 4
        }

        setTimeout(() => {
            io.in(roomId).emit('update-state', game)

            if (game.deck.length === 0 && game.players.some((p) => p.hand.length === 0)) {
                handleWin(roomId)
            }
        }, 3000)
    })

    socket.on('request-davi', (roomId) => {
        const game = games[roomId]
        if (!game) {
            console.log(`Game with ID: ${roomId} cannot be found.`)
            return
        }

        game.lastDavi = game.turn % 2

        io.in(roomId).emit('update-state', game)
        io.in(roomId).emit('send-davi-message')
    })

    socket.on('davi-accepted', (roomId) => {
        const game = games[roomId]
        if (!game) {
            console.log(`Game with ID: ${roomId} cannot be found.`)
            return
        }

        game.multiplier = game.multiplier + 1

        console.log(`Point multiplier increased: ${game.multiplier}`)
        io.in(roomId).emit('update-state', game)
        io.in(roomId).emit('close-davi-window')

        io.in(roomId).emit('display-message', 'Offer was accepted!')
        setTimeout(() => io.in(roomId).emit('remove-message'), 3000)
    })

    socket.on('davi-rejected', (roomId) => {
        const game = games[roomId]
        if (!game) {
            console.log(`Game with ID: ${roomId} cannot be found.`)
            return
        }

        io.in(roomId).emit('close-davi-window')
        game.players.forEach((player, i) => {
            if (i % 2 === game.turn % 2) {
                player.points += game.multiplier
            }
        })

        io.in(roomId).emit('display-message', 'Offer was rejected.')
        setTimeout(() => {
            io.in(roomId).emit('remove-message')
            startGame(roomId)
        }, 3000)
    })

    socket.on('leave-room', (roomId) => {
        socket.leave(roomId)
        console.log(`${socket.id} manually left Room: ${roomId}`)
    })

    socket.on('disconnect', () => {
        for (const roomId in games) {
            const game = games[roomId]

            const playerIndex = game.players.findIndex((p) => p.id === socket.id)
            if (playerIndex !== -1) {
                console.log(`${game.players[playerIndex].name} left Room: ${roomId}`)
                game.players.splice(playerIndex, 1)

                if (game.players.length === 0) {
                    console.log(`All players left Room: ${roomId}. Deleting game.`)
                    delete games[roomId]
                } else {
                    io.in(roomId).emit('update-state', game)
                }

                break
            }
        }
    })
})

const startGame = (roomId) => {
    const game = games[roomId]
    if (!game) {
        console.log(`Game with ID: ${roomId} cannot be found.`)
        return
    }

    const deck = shuffle(cards)
    game.deck = [...deck]
    game.trump = deck[deck.length - 1]
    game.multiplier = 1
    game.lastDavi = null

    game.players.forEach((player) => {
        player.hand = dealCards(game.deck, 5)
        player.taken = []
        player.played = []
    })

    console.log(`Started game: `, game)
    io.in(roomId).emit('update-state', game)
}

const handleWin = (roomId) => {
    const game = games[roomId]
    if (!game) {
        console.log(`Game with ID: ${roomId} cannot be found.`)
        return
    }

    const scores = [0, 0]
    const winnerIndexes = []
    game.players.forEach((player, i) => {
        scores[i % 2] += countPoints(player.taken.flat(Infinity))
    })

    const [team0, team1] = scores
    if (team0 !== team1) {
        const winnerTeam = team0 > team1 ? 0 : 1
        game.players.forEach((player, i) => {
            if (i % 2 === winnerTeam) {
                player.points += game.multiplier
                winnerIndexes.push(i)
            }
        })
    }

    game.turn = winnerIndexes[Math.round(Math.random())]

    console.log(scores)
    io.in(roomId).emit('display-message', `${game.players[winnerIndexes[0]].name} and ${game.players[winnerIndexes[1]].name} won with ${scores[winnerIndexes[0]]} points!`)

    setTimeout(() => {
        io.in(roomId).emit('remove-message')
        startGame(roomId)
    }, 3000)
}

const handleBura = (roomId) => {
    const game = games[roomId]
    if (!game) {
        console.log(`Game with ID: ${roomId} cannot be found.`)
        return
    }

    game.players.forEach((player, i) => {
        if (i % 2 === game.turn % 2) {
            player.points += game.multiplier
        }
    })

    io.in(roomId).emit('display-message', `${game.players[game.turn]} has aquired Bura!`)
    setTimeout(() => {
        io.in(roomId).emit('remove-message')
        startGame(roomId)
    }, 3000)
}
