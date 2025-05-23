import { createContext } from "react";

const ApiContext = createContext()
const ApiProvider = ({ children }) => {

    const data = {}
    return <ApiContext.Provider value={data}>
        { children }
    </ApiContext.Provider>
}

export { ApiProvider }
export default ApiContext