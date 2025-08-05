import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./Home";
import Game from "./Game";
import { useEffect } from "react";

const App = () => {
    const navigate = useNavigate()

    useEffect(() => {
        navigate('/')
    }, [])

    return <div>
        <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/game/:id' element={<Game />}/>
        </Routes>
    </div>
}

export default App;