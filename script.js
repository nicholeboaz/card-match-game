/* --- SETUP --- */ 

class Card {
    constructor(number, color, shape, shading) {
        this.number = number;
        this.color = color;
        this.shape = shape;
        this.shading = shading;
    }
}

class Deck {
    constructor(numbers, colors, shapes, shadings) {
        this.numbers = [1, 2, 3];
        this.colors = ['red', 'green', 'blue'];
        this.shapes = ['circle', 'heart', 'star'];
        this.shadings = ['empty', 'transparent', 'solid']
        let cards = [];
        for (let n = 0; n < this.numbers.length; n++) {
            for (let c = 0; c < this.colors.length; c++) {
                for (let s = 0; s < this.shapes.length; s++) {
                    for (let d = 0; d < this.shadings.length; d++) {
                        cards.push(new Card(n+1, this.colors[c], this.shapes[s], this.shadings[d]))
                    }
                }
            }
        }
        return cards;
    }
}

/* --- ELEMENTS --- */

const cardContainers = document.getElementsByClassName('card-container');
const cardOverlays = document.getElementsByClassName('card-overlay');

const matchesFoundEl = document.getElementById('matches-found');
const remainingCardsEl = document.getElementById('remaining-cards');
const modalEl = document.getElementById('modal');
const modalTextEl = document.getElementById('modal-text');

const modalCloseBtn = document.getElementById('modal-close-btn');
const checkMatchesBtn = document.getElementById('check-matches-btn');

const shapes = {
    solid: {
        circle: `<i class="fa-solid fa-circle"></i>`,
        heart: `<i class="fa-solid fa-heart"></i>`,
        star: `<i class="fa-solid fa-star"></i>`
    },
    regular: {
        circle: `<i class="fa-regular fa-circle"></i>`,
        heart: `<i class="fa-regular fa-heart"></i>`,
        star: `<i class="fa-regular fa-star"></i>`
    }
}

/* --- MAKE DECK --- */ 

const myDeck = new Deck();

function shuffle(deck)
{
    for (let i = 0; i < 1000; i++) {
        let location1 = Math.floor((Math.random() * deck.length));
        let location2 = Math.floor((Math.random() * deck.length));
        let temp = deck[location1];

        deck[location1] = deck[location2];
        deck[location2] = temp;
    }
    return deck;
}

const shuffledDeck = shuffle(myDeck);

/* --- RENDER CARDS --- */

const displayCards = [];

function renderCards() {
    while (displayCards.length < 12) {
        displayCards.push(shuffledDeck.shift());
    }
    for (let i = 0; i < displayCards.length; i++) {
        let shape = `<span class="card-shape ${displayCards[i].color} ${displayCards[i].shading}">${shapes.solid[displayCards[i].shape]}</span>`;
        let shapeOverlay = `<span class="card-shape ${displayCards[i].color}">${shapes.regular[displayCards[i].shape]}</span>`
        if (displayCards[i].number === 1) {
            cardContainers[i].innerHTML = 
                `<div class="card">
                    ${shape}
                </div>
                <div class="card-overlay">
                    ${shapeOverlay}
                </div>`
        } else if (displayCards[i].number === 2) {
            cardContainers[i].innerHTML = 
                `<div class="card">
                    ${shape}
                    ${shape}
                </div>
                <div class="card-overlay">
                    ${shapeOverlay}
                    ${shapeOverlay}
                </div>`
        } else {
            cardContainers[i].innerHTML = 
                `<div class="card">
                    ${shape}
                    ${shape}
                    ${shape}
                </div>
                <div class="card-overlay">
                    ${shapeOverlay}
                    ${shapeOverlay}
                    ${shapeOverlay}
                </div>`
        }
    }
    console.log(shuffledDeck.length)
}

renderCards();

/* --- FUNCTIONS --- */ 


function checkMatch([card1, card2, card3]) {
    function check(card1, card2, card3, key) {
        if (card1[key] !== card2[key] 
            && card1[key] !== card3[key] 
            && card2[key] !== card3[key]) {
            return true;
        } else if (card1[key] === card2[key]
            && card1[key] === card3[key] 
            && card2[key] === card3[key]) {
            return true;
        } else {
            return false;
        }
    }

    return (
        check(card1, card2, card3, "number") &&
        check(card1, card2, card3, "color") &&
        check(card1, card2, card3, "shape") &&
        check(card1, card2, card3, "shading")
    )
}

function checkForMatches(cards) {
    let matchCount = 0;
    for (let card of cards) {
        for (let i = cards.indexOf(card); i < (cards.length - 2); i++) {
            for (let j = i + 1; j < (cards.length - 1); j++) {
                let arr = [card, cards[i+1], cards[j+1]];
                if (checkMatch(arr)) {
                    matchCount++;
                    console.log(arr);
                }
            }
        }
    }
    return matchCount; 
}

/* --- EVENT LISTENER -- */

let selectedCards = 0;
let selectedMatch = [];

// click on card

for (let cardOverlay of cardOverlays) {

    let cardArr = [...cardOverlays];

    cardOverlay.addEventListener('click', () => {
        let position = cardArr.indexOf(cardOverlay);
        let currentCard = displayCards[position];
        if (cardOverlay.classList.contains('card-selected')) {
            cardOverlay.classList.toggle('card-selected');
            for (let card of selectedMatch) {
                if (card === currentCard) {
                    selectedMatch.splice(selectedMatch.indexOf(card), 1);
                }
            }
            selectedCards--;
        } else {
            if (selectedCards < 3) {
                cardOverlay.classList.toggle('card-selected');
                selectedMatch.push(displayCards[position]);
                selectedCards++;
                if (selectedCards === 3) {
                    if (checkMatch(selectedMatch)) {
                        const modalText = `You found a valid match! Congratulations!`;
                        displayModal(modalText);
                    } else {
                        const modalText = `Sorry, that isn't a valid match.`;
                        displayModal(modalText);
                    }
                }
            }
        }
    })
}

// buttons 

function displayModal(text) {
    modalEl.classList.remove('hidden');
    modalTextEl.textContent = text;
}

checkMatchesBtn.addEventListener('click', () => {
    const modalText = checkForMatches(displayCards) === 1 
    ? `There is currently ${checkForMatches(displayCards)} valid match.` 
    : `There are currently ${checkForMatches(displayCards)} valid matches.`;
    displayModal(modalText);
})

modalCloseBtn.addEventListener('click', () => {
    modalEl.classList.add('hidden');
    selectedCards = 0;
    selectedMatch = [];
    for (let cardOverlay of cardOverlays) {
        cardOverlay.classList.remove('card-selected');
    }
})

