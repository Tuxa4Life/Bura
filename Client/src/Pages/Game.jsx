import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useApiContext, useCallContext } from "../Hooks/useContexts"
import { images } from "../misc/cards"
import '../Styles/game.css'
import Card from "./Components/Card"

const Game = () => {
    const { id } = useParams()
    const { user, postItem, getItem } = useApiContext()
    const { triggerRooms } = useCallContext()

    const [scores, setScores] = useState([0, 0])
    const [deckCount, setDeckCount] = useState(36)

    const [oppHand, setOppHand] = useState([])
    const [playerHand, setPlayerHand] = useState([])

    const [oppPlay, setOppPlay] = useState([])
    const [playerPlay, setPlayerPlay] = useState([])

    useEffect(() => {
        return (() => {
            getItem('rooms', id).then((data) => {
                data.players = data.players.filter(x => x !== user.username)
                postItem('rooms', id, data).then(() => {
                    triggerRooms()
                })
            })
        })
    }, [])

    return <div className="game-container">
        <div className="deck">
            { deckCount > 1 ? <Card src={images.hearts_A} flipped /> : null }
            <p className="opp-score">{scores[1]}</p>
            <p className="deck-counter">{deckCount}</p>
            <p className="player-score">{scores[0]}</p>
            { deckCount > 0 ? <Card src={images.hearts_A} /> : null }
        </div>

        <div className="opp-hand hand">
            {
                oppHand.map((e, i) => {
                    <Card key={i} src={images[e]} flipped />
                })
            }
        </div>
        <div className="opp-play play">
            {
                oppPlay.map((e, i) => {
                    <Card key={i} src={images[e]} />
                })
            }
        </div>

        <div className="player-play play">
            {
                playerPlay.map((e, i) => {
                    <Card key={i} src={images[e]} />
                })
            }
        </div>
        <div className="player-hand hand">
            {
                playerHand.map((e, i) => {
                    <Card key={i} src={images[e]} player />
                })
            }
        </div>
    </div>
}

export default Game;