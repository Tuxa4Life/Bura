import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useApiContext, useCallContext } from "../Hooks/useContexts"

const Game = () => {
    const { id } = useParams()
    const { user, postItem, getItem } = useApiContext()
    const { triggerRooms } = useCallContext()

    useEffect(() => {
        return (() => {
            getItem('rooms', id).then((data) => {
                data.players = data.players.filter(x => x !== user.username)
                console.log(data)
                postItem('rooms', id, data).then(() => {
                    triggerRooms()
                })
            })
        })
    }, [])

    return <div>
        This is a game page
    </div>
}

export default Game;