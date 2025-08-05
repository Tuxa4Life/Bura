import { useParams } from "react-router-dom";
import { useSockets } from './Context/useContext'
import { useEffect, useState } from "react";
import { images } from "./cards";
import './Styles/game.css'
import DaviWind from "./Components/DaviWind";

const Game = () => {
    const { id } = useParams()
    const { game, message, myId, players, joinRoom, leaveRoom, changeState, setRoomId, requestDavi, daviWindow } = useSockets()
    const [myHand, setMyHand] = useState()
    const [selected, setSelected] = useState([])
    const [myIndex, setMyIndex] = useState(0)

    const renderPLayers = players.map((e, i) => <li key={i}>{e.name}</li>)

    useEffect(() => {
        const name = localStorage.getItem('name')
        const roomId = id

        joinRoom({ name, roomId })
    }, [])

    useEffect(() => {
        setRoomId(id)
        console.log(id)
    }, [id])

    useEffect(() => {
        const player = game.players.find(e => e.id === myId)
        setMyHand(player?.hand)

        const index = game.players.findIndex(e => e.id === myId)
        setMyIndex(index)
    }, [game.players])

    

    const select = (i) => {
        if (selected.includes(i)) {
            setSelected(prev => prev.filter(e => e !== i))
        } else {
            setSelected(prev => [...prev, i])
        }
    }

    const play = () => {
        const chosen = selected.map(i => myHand[i])
        const suites = chosen.map(e => e.split('_')[0])

        if (!suites.every(val => val === suites[0]) && game.players[(myIndex - 1 + 4) % 4].played.length === 0) {
            alert('Cards must be of same suit!')
            return
        }

        if (game.players[(myIndex - 1 + 4) % 4].played.length !== 0 && selected.length !== game.players[(myIndex - 1 + 4) % 4].played.length) {
            alert('You must play same amounts of cards.')
            return
        }

        const updatedGame = {
            ...game,
            players: game.players.map(p => {
                if (p.id === myId) {
                    return {
                        ...p,
                        hand: p.hand.filter(e => !chosen.includes(e)),
                        played: chosen,
                    }
                }
                return p
            }),
            turn: (game.turn + 1) % 4
        }

        changeState(updatedGame, id)
        setSelected([])
    }

    const davi = () => {
        if (game?.turn !== myIndex) {
            alert('It\'s not your turn yet')
            return
        }

        requestDavi(game)
    }

    return <div className="board">
        { daviWindow && <DaviWind playerIndex={myIndex} players={game?.players} turn={game?.turn} multiplier={game?.multiplier}/> }

        <div className="scoreboard">
            <h3>Points</h3>
            
            <div className="row">
                <p>{game?.players[0]?.name} & {game?.players[2]?.name}</p>
                <p>{game?.players[0]?.points}</p>
            </div>

            <hr />

            <div className="row">
                <p>{game?.players[1]?.name} & {game?.players[3]?.name}</p>
                <p>{game?.players[1]?.points}</p>
            </div>
        </div>

        <button onClick={davi} className="mult-btn">{game?.multiplier}x</button>

        {!((selected.length !== 0) && (myIndex === game?.turn)) && <p className="message">{message}</p>}

        <div className="player-one hand">
            <div className="card-container">
                {
                    game?.players[(myIndex + 1) % 4]?.hand.map((_, i) => {
                        return <img key={`${i}-left`} className="card" src="../cards/back_light.png" />
                    })
                }
            </div>
            <p style={{ transform: 'rotate(0deg)' }} className="username-opp">{game?.players[(myIndex + 1) % 4]?.name}</p>
            <div className="taken-amount-left">
                <img style={{ filter: 'brightness(80%) invert(1)' }} className="card" src="../cards/back_light.png" />
                <div className="taken-counter">{game?.players[(myIndex + 1) % 4]?.taken?.flat().flat().flat().length}</div>
            </div>
        </div>
        <div className="player-one-played">
            {
                game?.players[(myIndex + 1) % 4]?.played.map((e, i) => {
                    return <img key={`${i}-left-played`} className="card" src={images[e]} />
                })
            }
        </div>

        <div className="player-two hand">
            <div className="card-container">
                {
                    game?.players[(myIndex + 2) % 4]?.hand.map((_, i) => {
                        return <img key={`${i}-top`} className="card" src="../cards/back_light.png" />
                    })
                }
            </div>
            <p style={{ transform: 'rotate(180deg)' }} className="username-opp">{game?.players[(myIndex + 2) % 4]?.name}</p>
            <div className="taken-amount-top">
                <img style={{ filter: 'brightness(80%) invert(1)' }} className="card" src="../cards/back_light.png" />
                <div className="taken-counter">{game?.players[(myIndex + 3) % 4]?.taken?.flat().flat().flat().length}</div>
            </div>
        </div>
        <div className="player-two-played">
            {
                game?.players[(myIndex + 2) % 4]?.played.map((e, i) => {
                    return <img key={`${i}-top-played`} className="card" src={images[e]} />
                })
            }
        </div>

        <div className="player-three hand">
            <div className="card-container">
                {
                    game?.players[(myIndex + 3) % 4]?.hand.map((_, i) => {
                        return <img key={`${i}-right`} className="card" src="../cards/back_light.png" />
                    })
                }
            </div>
            <p style={{ transform: 'rotate(0deg)' }} className="username-opp">{game?.players[(myIndex + 3) % 4]?.name}</p>
            <div className="taken-amount-right">
                <img style={{ filter: 'brightness(80%) invert(1)' }} className="card" src="../cards/back_light.png" />
                <div className="taken-counter">{game?.players[(myIndex + 3) % 4]?.taken?.flat().flat().flat().length}</div>
            </div>
        </div>
        <div className="player-three-played">
            {
                game?.players[(myIndex + 3) % 4]?.played.map((e, i) => {
                    return <img key={`${i}-right-played`} className="card" src={images[e]} />
                })
            }
        </div>

        {((selected.length !== 0) && (myIndex === game?.turn)) && <button onClick={play} className="play-btn">PLAY</button>}

        <div className="my-hand hand">
            <div className="card-container">
                {
                    myHand?.map((e, i) => <img onClick={() => select(i)} key={i} src={images[e]} className={`card ${selected.includes(i) ? 'selected' : ''}`} />)
                }
            </div>
            <div className="taken-amount">
                <img style={{ filter: 'brightness(80%) invert(1)' }} className="card" src="../cards/back_light.png" />
                <div className="taken-counter">{game?.players[myIndex]?.taken?.flat().flat().flat().length}</div>
            </div>
        </div>
        <div className="my-played">
            {
                game?.players[myIndex]?.played.map((e, i) => {
                    return <img key={`${i}-played`} className="card" src={images[e]} />
                })
            }
        </div>

        <div className="deck">
            <img className={`card ${images[game?.deck[game?.deck?.length - 1]] ? '' : 'clipped'}`} src={images[game?.deck[game?.deck?.length - 1]] || `../cards/${game?.trump?.split('_')[0]}_A.png`} />
            <p>{game?.deck.length}</p>
        </div>

        {
            (players.length !== 4) &&
            <div style={{ width: '100%', height: '100dvh', position: 'fixed', top: '0', left: '0', zIndex: '1', backgroundColor: 'white' }}>
                <h1>ROOM ID: {id}</h1>
                <h1>Waiting for players... ({players.length}/4)</h1>
                <h3 style={{ margin: '0' }}>PLAYERS:</h3>
                <ol>
                    {renderPLayers}
                </ol>

                <button onClick={() => leaveRoom(id)}>Go back</button>
            </div>
        }
    </div>
}

export default Game;