import { useState } from "react";

const Card = ({src, flipped, player}) => {
    const [selected, setSelected] = useState(false)

    return <img onClick={() => {
        if (player) setSelected(!selected) 
    }} className={`${selected ? 'selected' : ''}`} src={flipped ? '../cards/back_light.png' : src} alt="" />
}

export default Card;