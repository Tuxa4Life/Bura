import { createRoot } from "react-dom/client";
import App from "./App";
import { ApiProvider } from "./Context/apiContext";
import { CallProvider } from "./Context/callContext";
import { BrowserRouter } from 'react-router-dom'

const root = createRoot(document.getElementById('root'))
root.render(
    <ApiProvider>
        <CallProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </CallProvider>
    </ApiProvider>
)