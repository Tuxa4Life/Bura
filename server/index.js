const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const cors = require("cors");
const {
    shuffle,
    cards,
    dealCards,
    getWinnerIndex,
    countPoints,
} = require("./cards");

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

const games = {};

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});

io.on("connection", (socket) => {
    //! Joining - leaving rooms
    socket.on("joinRoom", async ({ name, roomId }) => {
        socket.data.username = name;
        socket.data.roomId = roomId;
        socket.join(roomId);

        if (!games[roomId]) {
            games[roomId] = {
                players: [],
                deck: [],
                trump: "",
                multiplier: 1,
                turn: 0,
            };
        }

        const game = games[roomId];

        if (!game.players.find((p) => p.id === socket.id)) {
            game.players.push({
                id: socket.id,
                name,
                hand: [],
                played: [],
                taken: [],
                points: 0,
            });
        }

        io.to(roomId).emit("getPlayers", game.players);
    });

    socket.on("disconnect", () => {
        console.log(`DISCONNECTED: ${socket.id}`);
    });

    //! GAME STUFF
    socket.on("start-game", async (roomId) => {
        const game = games[roomId];
        startGame(game, roomId);
    });

    socket.on("change-game-state", async ({ game, roomId }) => {
        io.in(roomId).emit(
            "display-message",
            `${game.players[game.turn].name}'s turn.`
        );
        io.in(roomId).emit("initialize-game", game);

        let allPlayed = true;
        game.players.map((player) => {
            allPlayed = allPlayed && player.played.length !== 0;
        });

        if (!allPlayed) {
            return;
        }

        // If all players played their hands
        const input = [];
        game.players.forEach((player) => {
            input.push(player.played);
        });

        const winnerIndex = getWinnerIndex(input, game.trump);
        const winner = game.players[winnerIndex];

        winner.taken.push([input]);
        game.turn = winnerIndex;

        game.players.forEach((player) => {
            player.played = [];
        });

        let i = winnerIndex;
        while (
            game.players.some((p) => p.hand.length < 5) &&
            game.deck.length > 0
        ) {
            game.players[i].hand = [
                ...game.players[i].hand,
                ...dealCards(game.deck, 1),
            ];
            i = (i + 1) % 4;
        }

        io.in(roomId).emit(
            "display-message",
            `${game.players[winnerIndex].name} takes this hand.`
        );
        setTimeout(() => {
            io.in(roomId).emit("initialize-game", game);

            if (
                game.deck.length === 0 &&
                game.players.some((p) => p.hand.length === 0)
            ) {
                handleWin(game, roomId);
            } else {
                io.in(roomId).emit("remove-message");
            }
        }, 3000);
    });

    socket.on('request-davi', ({ roomId }) => {
        io.in(roomId).emit('send-davi-message')
    })

    socket.on('davi-accepted', ({roomId, game}) => {
        game.multiplier = game.multiplier + 1
        io.in(roomId).emit("initialize-game", game);
        io.in(roomId).emit('close-davi-window')

        io.in(roomId).emit(
            "display-message",
            `Offer accepted!`
        );

                
        setTimeout(() => io.in(roomId).emit("remove-message"), 3000)
    })

    socket.on('davi-rejected', ({roomId, game}) => {
        io.in(roomId).emit('close-davi-window')
        game.players.forEach((player, i) => {
            if (i % 2 === game.turn % 2) {
                player.points += game.multiplier
            }
        })

        io.in(roomId).emit(
            "display-message",
            `Offer rejected!`
        );

                
        setTimeout(() => {
            io.in(roomId).emit("remove-message")
            startGame(game, roomId)
        }, 3000)
    })
});

const startGame = (game, roomId) => {
    if (!game) return;

    const initialDeck = shuffle(cards);

    game.deck = [...initialDeck];
    game.trump = initialDeck[initialDeck.length - 1];
    game.multiplier = 1;

    game.players.forEach((player) => {
        player.hand = dealCards(game.deck, 5);
        player.taken = [];
        player.played = []
    });

    io.in(roomId).emit("initialize-game", game);
};

const handleWin = (game, roomId) => {
    const scores = [0, 0];
    const winnerIndexes = [];
    game.players.forEach((player, i) => {
        scores[i % 2] += countPoints(player.taken.flat(Infinity));
    });

    if (scores[0] > scores[1]) {
        game.players.forEach((player, i) => {
            if (i % 2 === 0) {
                player.points += game.multiplier;
                winnerIndexes.push(i);
            }
        });

        io.in(roomId).emit(
            "display-message",
            `${game.players[0].name} and ${game.players[2].name} \nwin this round with ${scores[0]} points!`
        );
    } else if (scores[0] < scores[1]) {
        game.players.forEach((player, i) => {
            if (i % 2 !== 0) {
                player.points += game.multiplier;
                winnerIndexes.push(i);
            }
        });

        io.in(roomId).emit(
            "display-message",
            `${game.players[1].name} and ${game.players[3].name} \nwin this round with ${scores[1]} points!`
        );
    } else {
        io.in(roomId).emit("display-message", `This round was a draw!`);
    }

    startGame(game, roomId);
    game.turn = winnerIndexes[Math.round(Math.random())];

    setTimeout(() => {
        io.in(roomId).emit("remove-message");
    }, 3000);
};
