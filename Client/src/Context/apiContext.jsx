import { createContext, useState } from "react";
import { db } from "../firebase.js";
import { collection, getDocs, getDoc, doc, setDoc, deleteDoc } from "firebase/firestore";

const ApiContext = createContext()
const ApiProvider = ({ children }) => {
    const [user, setUser] = useState({ username: 'Guest', id: '' })
    const [rooms, setRooms] = useState([])

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

    const postItem = async (col, id, obj) => {
        try {
            const docRef = doc(db, col, id)
            await setDoc(docRef, obj)
            return id
        } catch (e) {
            console.error("Error adding document:", e)
        }
    }

    const deleteItem = async (col, id) => {
        try {
            await deleteDoc(doc(db, col, id));
        } catch (e) {
            console.error("Error deleting document:", e);
        }
    }

    const getRooms = async () => {
        const response = await fetchCol('rooms')
        setRooms([...response])
    }

    const data = { user, rooms, setUser, postItem, deleteItem, getRooms, getItem }
    return <ApiContext.Provider value={data}>
        {children}
    </ApiContext.Provider>
}

export { ApiProvider }
export default ApiContext