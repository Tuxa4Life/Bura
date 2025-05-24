import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApiContext, useCallContext } from '../../Hooks/useContexts'

const Room = ({name, count}) => {
    let navigate = useNavigate()
    const { getItem, postItem, user } = useApiContext()
    const { triggerRooms } = useCallContext()

    const btn = useRef(null)

    useEffect(() => {
        if (count >= 2) btn.current.disabled = true
        else btn.current.disabled = false
    }, [count])

    const handleJoin = () => {
        getItem('rooms', name).then((doc) => {
            doc.players.push(user.username)
            postItem('rooms', name, doc).then(() => {
                navigate(`/game/${name}`)
                triggerRooms()
            })
        })

    }

    return <div className="room-item">
        <h4>{name}</h4>
        <h4>{count}/2</h4>
        <button ref={btn} onClick={handleJoin} className="ui button secondary inverted">Join</button>
    </div>
}

export default Room;