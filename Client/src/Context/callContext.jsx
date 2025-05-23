import { createContext } from "react";
import { io } from "socket.io-client";

const socket = io.connect('http://localhost:3001/')
const CallContext = createContext()
const CallProvider = ({ children }) => {
    

    const data = {}
    return <CallContext.Provider value={data}>
        { children }
    </CallContext.Provider>
}

export { CallProvider }
export default CallContext