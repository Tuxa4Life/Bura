import { useSockets } from "../Context/useContext";

const DaviWind = ({ players, playerIndex, turn, multiplier }) => {
    const { acceptDavi, rejectDavi } = useSockets()

    const getWording = (multiplier) => {
        switch (multiplier + 1) {
            case 2: return 'Davi';
            case 3: return 'Se';
            case 4: return 'Chari';
            case 5: return 'Phanji';
            case 6: return 'Shashi';
            case 7: return 'Hafti';
            case 8: return 'Hashti';
            case 9: return 'Nohi';
            case 10: return 'Dahi';
            case 11: return 'Iazdahi';
            default: return `${multiplier + 1}x point multiplier.`;
        }
    };

    return <div style={{ width: '100%', height: '100dvh', position: 'fixed', top: '0', left: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: '10' }}>
        {
            ((turn + 1) % 4 === playerIndex) && <div className="menu" style={{ width: '350px', height: '200px', backgroundColor: 'white', borderRadius: '7px', padding: '10px' }}>
                <h1 style={{ textAlign: 'center', marginTop: '15px' }}>{players[turn]?.name} <br /> offered you <br /> {getWording(multiplier)}</h1>

                <div className="buttons" style={{ display: 'flex', width: '100%', justifyContent: 'space-evenly', marginTop: '20px' }}>
                    <button onClick={acceptDavi} style={{ width: '120px', height: '40px', backgroundColor: 'limegreen', border: 'none', fontSize: '24px', cursor: 'pointer' }}>Accept</button>
                    <button onClick={rejectDavi} style={{ width: '120px', height: '40px', backgroundColor: 'red', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>Reject</button>
                </div>
            </div>
        }

        {
            (turn === playerIndex) && <div className="menu" style={{ width: '350px', height: '200px', backgroundColor: 'white', borderRadius: '7px', padding: '10px' }}>
                <h1 style={{ textAlign: 'center', marginTop: '20%' }}>Waiting {players[(turn + 1) % 4]?.name} to respsond to {getWording(multiplier)}</h1>
            </div>
        }

        {
            ((turn !== playerIndex) && ((turn + 1) % 4 !== playerIndex)) && <div className="menu" style={{ width: '350px', height: '200px', backgroundColor: 'white', borderRadius: '7px', padding: '10px' }}>
                <h1 style={{ textAlign: 'center', marginTop: '10px' }}>{players[turn]?.name} offered {players[(turn + 1) % 4]?.name} <br /> {getWording(multiplier)}. <br /> waiting {players[(turn + 1) % 4]?.name} to respond</h1>
            </div>
        }
    </div>
}

export default DaviWind;