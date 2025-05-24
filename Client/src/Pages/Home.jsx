import { useState } from 'react';
import { useApiContext, useCallContext } from '../Hooks/useContexts'
import '../Styles/home.css'
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [input, setInput] = useState('')
    const { setUser } = useApiContext()
    const { socketEnterLobby } = useCallContext()

    let navigate = useNavigate()

    const submit = (e) => {
        e.preventDefault()

        setUser(prev => ({ username: input || 'Guest', id: prev.id }))
        socketEnterLobby()
        navigate('/lobby')
    }

    return <div className='container'>
        <form onSubmit={submit} className='ui form'>
            <div className="field">
                <h2>Enter username</h2>
                <input type="text" placeholder="Guest" value={input} onChange={e => setInput(e.target.value.slice(0, 20))} />
            </div>

            <button className='ui button secondary inverted' type='submit'>Submit</button>
        </form>
    </div>
}

export default Home;