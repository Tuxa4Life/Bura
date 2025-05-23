import { createContext } from "react";
import { db } from "../firebase.js";
import { addDoc, collection, getDocs, getDoc } from "firebase/firestore";

const ApiContext = createContext()
const ApiProvider = ({ children }) => {

    const fetchCol = async (col) => {
        const output = []

        const response = await getDocs(collection(db, col))
        response.forEach((doc) => {
            output.push(doc.data())
        })

        return output
    }

    const getItem = async (col, id) => {
        const docSnap = await getDoc(doc(db, col, id))
        if (docSnap.exists()) return docSnap.data()
    }

    const postCol = async (col, obj) => {
        try {
            const response = await addDoc(collection(db, col), obj)
            return response.id
        } catch (e) {
            console.error("Error adding document:", e)
        }
    }

    const data = { fetchCol, postCol, getItem }
    return <ApiContext.Provider value={data}>
        {children}
    </ApiContext.Provider>
}

export { ApiProvider }
export default ApiContext