class TarotCard {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }

  display() {
    return this.value + " of " + this.suit;
  }
}

class TarotDeck {
  constructor() {
    this.suits = ['Cups', 'Swords', 'Wands', 'Pentacles'];
    this.values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Page', 'Knight', 'Queen', 'King', 'Ace'];
    this.trumpCards = ['The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor', 'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit', 'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance', 'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun', 'Judgement', 'The World'];
    this.cards = [];

    for (let suit of this.suits) {
      for (let value of this.values) {
        this.cards.push(new TarotCard(suit, value));
      }
    }

    for (let trump of this.trumpCards) {
      this.cards.push(new TarotCard('Major Arcana', trump));
    }
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  deal() {
    return this.cards.pop();
  }
}

// Create a new Deck
let deck = new TarotDeck();
// Shuffle the deck
deck.shuffle();
// Deal a card
console.log(deck.deal().display());

// what if we wanted to factor in the reverse order
// how can we edit the code to assing those reversed values in addition conection to a database with the actual meanings.

function createTarotDeck() {
    let suits = ['Wands', 'Cups', 'Swords', 'Pentacles'];
    let ranks = ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'];
    let majorArcana = ['The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor', 'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit', 'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance', 'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun', 'Judgement', 'The World'];
    let deck = [];
  
    for(let suit of suits) {
      for(let rank of ranks) {
        deck.push({ 
          name: `${rank} of ${suit}`, 
          upright: true
        });
      }
    }
  
    for(let card of majorArcana) {
      deck.push({ 
        name: card, 
        upright: true 
      });
    }
  
    return deck;
  }
  
  // Function to draw a card and reverse it
  function drawCard(deck) {
    let card = deck.pop();
    card.upright = !card.upright;
    
    if (card.upright) {
      console.log(`${card.name} (Upright)`);
    } else {
      console.log(`${card.name} (Reversed)`);
    }
    
    return card;
  }
  
  let tarotDeck = createTarotDeck();
  drawCard(tarotDeck); // Draw a card and log whether it's upright or reversed
  