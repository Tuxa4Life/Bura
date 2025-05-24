const generateImages = () => {
  const suits = ['clubs', 'diamonds', 'hearts', 'spades']
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

  const cardImages = {}

  suits.forEach(suit =>
    values.forEach(value => {
      const key = `${suit}_${value}`
      cardImages[key] = `./cards/${key}.png`
    })
  )

  return cardImages
}

const generateKeys = () => {
  const suits = ['clubs', 'diamonds', 'hearts', 'spades']
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

  const keys = []

  suits.forEach(suit =>
    values.forEach(value => {
      keys.push(`${suit}_${value}`)
    })
  )

  return keys
}

const shuffle = arr => arr.sort(() => Math.random() - 0.5);

const images = generateImages()
const keys = generateKeys()