const generateKeys = () => {
    const suits = ["clubs", "diamonds", "hearts", "spades"];
    const values = ["6", "7", "8", "9", "10", "J", "Q", "K", "A"];

    const keys = [];

    suits.forEach((suit) =>
        values.forEach((value) => {
            keys.push(`${suit}_${value}`);
        })
    );

    return keys;
};

const getWinnerIndex = (cards, trumpCard) => {
    const order = ["6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    const getSuit = (c) => c.split("_")[0];
    const getValue = (c) => c.split("_")[1];
    const getPower = (c) => order.indexOf(getValue(c));

    const trumpSuit = getSuit(trumpCard);
    const leadSuit = getSuit(cards[0][0]);

    let maxIndex = 0;
    let maxCard = cards[0][0];

    for (let i = 1; i < cards.length; i++) {
        const card = cards[i][0];

        const isTrump = getSuit(card) === trumpSuit;
        const isLead = getSuit(card) === leadSuit;
        const maxIsTrump = getSuit(maxCard) === trumpSuit;
        const maxIsLead = getSuit(maxCard) === leadSuit;

        if (isTrump && !maxIsTrump) {
            maxCard = card;
            maxIndex = i;
        } else if (isTrump && maxIsTrump) {
            if (getPower(card) > getPower(maxCard)) {
                maxCard = card;
                maxIndex = i;
            }
        } else if (!isTrump && !maxIsTrump && isLead && maxIsLead) {
            if (getPower(card) > getPower(maxCard)) {
                maxCard = card;
                maxIndex = i;
            }
        }
    }

    return maxIndex;
};

const countPoints = (takenCards) => {
    let output = 0
    takenCards.forEach(card => {
        const value = card.split('_')[1]
        switch(value) {
            case 'J': output += 2; break;
            case 'Q': output += 3; break;
            case 'K': output += 4; break;
            case '10': output += 10; break;
            case 'A': output += 11; break;
            default: output += 0; break;
        }
    })

    return output
}

const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
const dealCards = (deck, n) => deck.splice(0, n);

const cards = generateKeys();

module.exports = { cards, shuffle, dealCards, getWinnerIndex, countPoints };
