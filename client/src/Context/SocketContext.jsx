import { createContext, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client'

const socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000')

const SocketContext = createContext()
const SocketProvider = ({ children }) => {
    const [name, setName] = useState('')
    const [roomId, setRoomId] = useState('')

    const [message, setMessage] = useState('')
    const [myIndex, setMyIndex] = useState(null)

    const [game, setGame] = useState({
        players: [],
        deck: [],
        trump: '',
        turn: 0
    })

    const navigate = useNavigate()

    const [daviWindow, setDaviWindow] = useState()

    useEffect(() => {
        const handleBeforeUnload = () => {
            socket.disconnect()
        }

        window.addEventListener('beforeunload', handleBeforeUnload)

        socket.on('update-state', (data) => {
            setGame(data)
        })

        socket.on('display-message', (text) => {
            setMessage(text)
        })

        socket.on('remove-message', () => {
            setMessage('')
        })

        socket.on('send-davi-message', () => {
            setDaviWindow(true)
        })

        socket.on('close-davi-window', () => {
            setDaviWindow(false)
        })

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)

            socket.off('connect')
            socket.off('update-state')
            socket.off('display-message')
            socket.off('remove-message')
            socket.off('send-davi-message')
            socket.off('close-davi-window')
        }
    }, [])

    useEffect(() => {
        if (myIndex === null || myIndex === -1) {
            const index = game.players.findIndex(e => {
                console.log(e.id, socket.id)
                return e.id === socket.id
            })
            setMyIndex(index)
        }
    }, [game.players, myIndex])

    const joinRoom = useCallback((name_and_id) => {
        socket.emit('join-room', name_and_id);
    }, []);

    const leaveRoom = () => {
        socket.emit('leave-room', roomId)
        navigate('/')
    }

    const changeState = (chosen) => {
        socket.emit('player-played', { roomId, played: chosen })
    }

    const requestDavi = () => {
        socket.emit('request-davi', roomId)
    }

    const acceptDavi = () => {
        socket.emit('davi-accepted', roomId)
    }

    const rejectDavi = () => {
        socket.emit('davi-rejected', roomId)
    }

    const data = { name, setName, roomId, setRoomId, game, myIndex, message, daviWindow, setGame, joinRoom, leaveRoom, changeState, requestDavi, acceptDavi, rejectDavi }
    return <SocketContext.Provider value={data}>
        {children}
    </SocketContext.Provider>
}

export default SocketContext;
export { SocketProvider }