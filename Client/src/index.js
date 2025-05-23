import { createRoot } from "react-dom/client";
import App from "./App";
import { ApiProvider } from "./Context/apiContext";
import { CallProvider } from "./Context/callContext";

const root = createRoot(document.getElementById('root'))
root.render(
    <ApiProvider>
        <CallProvider>
            <App />
        </CallProvider>
    </ApiProvider>
)