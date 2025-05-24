import { createContext } from "react";
import { io } from "socket.io-client";
import { useApiContext } from "../Hooks/useContexts";

const socket = io.connect('http://localhost:3001/')
const CallContext = createContext()
const CallProvider = ({ children }) => {
    const { user, setUser, postItem, deleteItem, getRooms } = useApiContext()

    socket.on('create-user', (data) => {
        setUser(prev => ({ username: prev.username, id: data.id }))
        postItem('active-users', data.id, { username: user.username, id: data.id })
    })

    socket.on('delete-on-disconnect', (data) => {
        deleteItem('active-users', data.id)
    })

    socket.on('refresh-rooms', () => {
        getRooms()
    })

    const socketEnterLobby = () => {
        socket.emit('entered-lobby')
    }

    const triggerRooms = () => {
        socket.emit('room-created')
    }

    const data = { socketEnterLobby, triggerRooms }
    return <CallContext.Provider value={data}>
        { children }
    </CallContext.Provider>
}

export { CallProvider }
export default CallContext