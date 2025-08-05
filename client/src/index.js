import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { SocketProvider } from "./Context/SocketContext";

const root = createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <SocketProvider>
            <App />
        </SocketProvider>
    </BrowserRouter>
);
