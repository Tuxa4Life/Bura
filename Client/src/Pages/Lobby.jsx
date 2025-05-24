import { useEffect, useRef, useState } from 'react';
import '../Styles/lobby.css'
import Room from './Components/Room';
import { useApiContext, useCallContext } from '../Hooks/useContexts';
import { useNavigate } from 'react-router-dom';

const Lobby = () => {
    const [roomName, setRoomName] = useState('')
    const { triggerRooms } = useCallContext()
    const { user, rooms, postItem } = useApiContext()

    const btn = useRef(null)
    let navigate = useNavigate()

    useEffect(() => {
        triggerRooms()
    }, [])

    const renderedRooms = rooms.map(e => {
        return <Room key={e.id} name={e.id} count={e.players.length} />
    })

    const submit = (e) => {
        e.preventDefault()
        if (roomName === '') return

        btn.current.disabled = true
        setRoomName('')
        postItem('rooms', roomName, {
            id: roomName,
            players: [user.username]
        }).then(() => {
            triggerRooms()
            btn.current.disabled = false
            navigate(`/game/${roomName}`)
        })
    }

    return <div className="container">
        <form onSubmit={submit} className="ui action input">
            <input type="text" placeholder="Room name" value={roomName} onChange={e => setRoomName(e.target.value.replace(/[\/\?\#\&\=\s]/g, '').slice(0, 20))} />
            <button ref={btn} type='submit' className="ui button secondary inverted">Create a room</button>
        </form>

        <h1>Rooms</h1>
        <div className="room-list">
            { renderedRooms || <p>There are no rooms. Create one!</p> }
        </div>
    </div>
}

export default Lobby;