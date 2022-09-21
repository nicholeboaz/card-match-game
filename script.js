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

const groupsFoundEl = document.getElementById('groups-found');
const remainingCardsEl = document.getElementById('remaining-cards');
const modalEl = document.getElementById('modal');
const modalTextEl = document.getElementById('modal-text');

const modalCloseBtn = document.getElementById('modal-close-btn');
const checkGroupsBtn = document.getElementById('check-groups-btn');

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

const displayCards = [];

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

/* --- RENDER CARDS --- */

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

function checkGroup([card1, card2, card3]) {
    let numberSet = false;
    let colorSet = false;
    let shapeSet = false;
    let shadingSet = false;

    if (card1.number !== card2.number 
        && card1.number !== card3.number 
        && card2.number !== card3.number) {
        numberSet = true;
    } else if (card1.number === card2.number
        && card1.number === card3.number 
        && card2.number === card3.number) {
        numberSet = true;
    }

    if (card1.color !== card2.color 
        && card1.color !== card3.color 
        && card2.color !== card3.color) {
        colorSet = true;
    } else if (card1.color === card2.color
        && card1.color === card3.color 
        && card2.color === card3.color) {
        colorSet = true;
    }

    if (card1.shape !== card2.shape 
        && card1.shape !== card3.shape 
        && card2.shape !== card3.shape) {
        shapeSet = true;
    } else if (card1.shape === card2.shape
        && card1.shape === card3.shape 
        && card2.shape === card3.shape) {
        shapeSet = true;
    }

    if (card1.shading !== card2.shading 
        && card1.shading !== card3.shading 
        && card2.shading !== card3.shading) {
        shadingSet = true;
    } else if (card1.shading === card2.shading
        && card1.shading === card3.shading 
        && card2.shading === card3.shading) {
        shadingSet = true;
    }

    if (numberSet === true && colorSet === true && shapeSet === true && shadingSet === true) {
        return true;
    } else {
        return false;
    }
}

function checkForGroups(cards) {
    let groupCount = 0;
    for (let card of cards) {
        for (let i = cards.indexOf(card); i < (cards.length - 2); i++) {
            for (let j = i + 1; j < (cards.length - 1); j++) {
                let arr = [card, cards[i+1], cards[j+1]];
                if (checkGroup(arr)) {
                    groupCount++;
                    // console.log(arr);
                }
            }
        }
    }
    return groupCount; 
}

/* --- EVENT LISTENER -- */

let selectedCards = 0;
let selectedGroup = [];

// click on card

for (let cardOverlay of cardOverlays) {

    let cardArr = [...cardOverlays];

    cardOverlay.addEventListener('click', () => {
        let position = cardArr.indexOf(cardOverlay);
        let currentCard = displayCards[position];
        if (cardOverlay.classList.contains('card-selected')) {
            cardOverlay.classList.toggle('card-selected');
            for (let card of selectedGroup) {
                if (card === currentCard) {
                    selectedGroup.splice(selectedGroup.indexOf(card), 1);
                }
            }
            selectedCards--;
        } else {
            if (selectedCards < 3) {
                cardOverlay.classList.toggle('card-selected');
                selectedGroup.push(displayCards[position]);
                selectedCards++;
                if (selectedCards === 3) {
                    if (checkGroup(selectedGroup)) {
                        const modalText = `You found a valid group! Congratulations!`;
                        displayModal(modalText);
                    } else {
                        const modalText = `Sorry, that isn't a valid group.`;
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

checkGroupsBtn.addEventListener('click', () => {
    const modalText = checkForGroups(displayCards) === 1 
    ? `There is currently ${checkForGroups(displayCards)} valid group.` 
    : `There are currently ${checkForGroups(displayCards)} valid groups.`;
    displayModal(modalText);
})

modalCloseBtn.addEventListener('click', () => {
    modalEl.classList.add('hidden');
    selectedCards = 0;
    selectedGroup = [];
    for (let cardOverlay of cardOverlays) {
        cardOverlay.classList.remove('card-selected');
    }
})

