import { createRoot } from "react-dom/client";
import App from "./App";
import ApiContext from "./Context/apiContext";
import CallContext from "./Context/callContext";

const root = createRoot(document.getElementById('root'))
root.render(
    <ApiContext>
        <CallContext>
            <App />
        </CallContext>
    </ApiContext>
)