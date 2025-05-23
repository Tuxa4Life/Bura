import { useContext } from "react";
import CallContext from "../Context/callContext";
import ApiContext from "../Context/apiContext";

const useCallContext = () => { return useContext(CallContext) }
const useApiContext = () => { return useContext(ApiContext) }

export { useCallContext, useApiContext }