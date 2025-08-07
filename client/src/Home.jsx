import { useNavigate } from 'react-router-dom'
import { useSockets } from './Context/useContext'

const Home = () => {
    const navigate = useNavigate()

    const { name, roomId, setName, setRoomId } = useSockets()

    const submit = (e) => {
        e.preventDefault()
        navigate(`/game/${roomId}`)
    }

    return <div style={{width: '100%', height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <form onSubmit={submit} style={{height: '60vh', display: 'flex', flexDirection: 'column'}}>
            <h1 style={{margin: '0'}}>Bura 4 Kaca 5 Karta</h1>
            <i>(experimantal)</i>

            <div style={{margin: '20px 0 5px 0'}} className="field">
                <label>Name: </label>
                <input value={name} onChange={e => setName(e.target.value)} required type="text" />
            </div>

            <div style={{margin: '5px 0 20px 0'}} className="field">
                <label>Room ID: </label>
                <input value={roomId} onChange={e => setRoomId(e.target.value)} required type="text" />
            </div>

            <button type="submit">Join Game</button>
        </form>
    </div>
}

export default Home;