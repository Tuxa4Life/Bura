import { useParams } from "react-router-dom";
import { useSockets } from './Context/useContext'
import React, { useEffect, useState } from "react";
import { images } from "./cards";
import './Styles/game.css'
import DaviWind from "./Components/DaviWind";

const Game = () => {
    const { id } = useParams()
    const { game, name, roomId, message, myIndex, joinRoom, leaveRoom, changeState, requestDavi, daviWindow } = useSockets()
    const [selected, setSelected] = useState([])

    useEffect(() => {
        joinRoom({ name, roomId })
    }, [])

    const select = (i) => {
        if (selected.includes(i)) {
            setSelected(prev => prev.filter(e => e !== i))
        } else {
            setSelected(prev => [...prev, i])
        }
    }

    const play = () => {
        const chosen = selected.map(i => game?.players[myIndex]?.hand[i])
        const suites = chosen.map(e => e.split('_')[0])

        if (!suites.every(val => val === suites[0]) && game.players[(myIndex - 1 + 4) % 4].played.length === 0) {
            alert('Cards must be of same suit!')
            return
        }

        if (game.players[(myIndex - 1 + 4) % 4].played.length !== 0 && selected.length !== game.players[(myIndex - 1 + 4) % 4].played.length) {
            alert('You must play same amounts of cards.')
            return
        }

        changeState(chosen)
        setSelected([])
    }

    const davi = () => {
        if (game?.turn !== myIndex) {
            alert('It\'s not your turn yet')
            return
        }

        if (game?.lastDavi === game?.turn % 2) {
            alert('Cannot send challange! Your team already sent it.')
            return
        }

        requestDavi(game)
    }

    const oppHands = [1, 2, 3].map((offset) => {
        const playerIndex = (myIndex + offset) % 4;
        const position = ['one', 'two', 'three'][offset - 1]; // just for classNames
        const rotate = offset === 2 ? '180deg' : '0deg'; // top player
        const positionClass = ['left', 'top', 'right'][offset - 1];

        return (
            <React.Fragment key={`player-${position}`}>
                <div className={`player-${position} hand`}>
                    <div className="card-container">
                        {
                            game?.players[playerIndex]?.hand.map((_, i) => (
                                <img key={`${i}-${positionClass}`} className="card" src="../cards/back_light.png" />
                            ))
                        }
                    </div>
                    <p style={{ transform: `rotate(${rotate})` }} className="username-opp">
                        {game?.players[playerIndex]?.name}
                    </p>
                    <div className={`taken-amount-${positionClass}`}>
                        <img style={{ filter: 'brightness(80%) invert(1)' }} className="card" src="../cards/back_light.png" />
                        <div className="taken-counter">
                            {game?.players[playerIndex]?.taken?.flat(3).length}
                        </div>
                    </div>
                </div>
                <div className={`player-${position}-played`}>
                    {
                        game?.players[playerIndex]?.played.map((e, i) => (
                            <img key={`${i}-${positionClass}-played`} className="card" src={images[e]} />
                        ))
                    }
                </div>
            </React.Fragment>
        );
    })

    return <div className="board">
        {daviWindow && <DaviWind playerIndex={myIndex} players={game?.players} turn={game?.turn} multiplier={game?.multiplier} />}

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
        { (myIndex === game?.turn && !message && (selected.length === 0)) && <p className="message">Your turn!</p> }

        {((selected.length !== 0) && (myIndex === game?.turn)) && <button onClick={play} className="play-btn">PLAY</button>}

        { oppHands }

        <div className="my-hand hand">
            <div className="card-container">
                {
                    game?.players[myIndex]?.hand?.map((e, i) => <img onClick={() => select(i)} key={i} src={images[e]} className={`card ${selected.includes(i) ? 'selected' : ''}`} />)
                }
            </div>
            <div className="taken-amount">
                <img style={{ filter: 'brightness(80%) invert(1)' }} className="card" src="../cards/back_light.png" />
                <div className="taken-counter">{game?.players[myIndex]?.taken?.flat(Infinity).length}</div>
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
            <p style={{opacity: game?.deck.length !== 0 ? '1' : '0'}}>{game?.deck.length}</p>
        </div>

        {
            (game?.players.length !== 4) &&
            <div style={{ width: '100%', height: '100dvh', position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '1', backgroundColor: 'white' }}>
                <h1>ROOM ID: {id}</h1>
                <h1>Waiting for players... ({game?.players.length}/4)</h1>
                <h3 style={{ margin: '0' }}>PLAYERS:</h3>
                <ol>
                    {game?.players.map((e, i) => <li key={i}>{e.name}</li>)}
                </ol>

                <button onClick={() => leaveRoom(id)}>Go back</button>
            </div>
        }
    </div>
}

export default Game;