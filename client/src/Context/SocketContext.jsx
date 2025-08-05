import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from 'socket.io-client'

const socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000')

const SocketContext = createContext()
const SocketProvider = ({ children }) => {
    const [roomId, setRoomId] = useState('1')
    const [message, setMessage] = useState('')

    const [players, setPlayers] = useState([])
    const [game, setGame] = useState({
        players: [],
        deck: [],
        trump: '',
        turn: 0
    })
    const [myId, setMyId] = useState('')

    const navigate = useNavigate()

    useEffect(() => {
        socket.on('connect', () => {
            setMyId(socket.id);
        });

        socket.on('getPlayers', (data) => {
            setPlayers(data);

            if (data.length === 4) {
                socket.emit('start-game', roomId);
            }
        });

        socket.on('initialize-game', (data) => {
            setGame(data)
            console.log('Initialized called', data)
        })

        socket.on('display-message', (text) => {
            setMessage(text)
        })

        socket.on('remove-message', () => {
            setTimeout(() => setMessage(''), 500)
        })

        return () => {
            socket.off('getPlayers');
            socket.off('initialize-game');
            socket.off('changed-game-state');
            socket.off('connect')
            socket.off('test')
        }
    }, [])



    const joinRoom = (name_and_id) => socket.emit('joinRoom', name_and_id)
    const leaveRoom = (roomId) => { // TODO: fix leaving
        socket.emit('leaveRoom', roomId)
        navigate('/')
    }

    const changeState = (game, roomId) => {
        socket.emit('change-game-state', { roomId, game })
    }

    const data = { game, message, setGame, setRoomId, players, myId, joinRoom, leaveRoom, changeState }
    return <SocketContext.Provider value={data}>
        {children}
    </SocketContext.Provider>
}

export default SocketContext;
export { SocketProvider }