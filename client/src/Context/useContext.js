import { useContext } from "react";
import SocketContext from "./SocketContext";

const useSockets = () => { return useContext(SocketContext) }

export { useSockets }