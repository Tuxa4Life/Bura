import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Lobby from "./Pages/Lobby";
import Game from "./Pages/Game";

const App = () => {
    return <>
        <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/game/:id" element={<Game />} />z
        </Routes>
    </>
}

export default App;