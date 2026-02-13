/**
 * Euchre Game - Vanilla JS Implementation
 */

// Constants
const SUITS = {
    SPADES: 'spades',
    HEARTS: 'hearts',
    DIAMONDS: 'diamonds',
    CLUBS: 'clubs'
};

const RANKS = {
    NINE: '9',
    TEN: '10',
    JACK: 'J',
    QUEEN: 'Q',
    KING: 'K',
    ACE: 'A'
};

const PHASES = {
    DEALING: 'DEALING',
    BIDDING_ROUND_1: 'BIDDING_ROUND_1',
    BIDDING_ROUND_2: 'BIDDING_ROUND_2',
    DISCARDING: 'DISCARDING',
    PLAYING: 'PLAYING',
    SCORING: 'SCORING',
    END_OF_GAME: 'END_OF_GAME'
};

class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.phase = PHASES.DEALING;
        this.players = [
            { name: 'Computer 1', type: 'AI', hand: [], tricks: 0 }, // West (Index 0)
            { name: 'Computer 2', type: 'AI', hand: [], tricks: 0 }, // North (Index 1) - Partner
            { name: 'Computer 3', type: 'AI', hand: [], tricks: 0 }, // East (Index 2)
            { name: 'You', type: 'HUMAN', hand: [], tricks: 0 }      // South (Index 3)
        ];
        this.dealerIndex = Math.floor(Math.random() * 4);
        this.currentPlayerIndex = (this.dealerIndex + 1) % 4;
        this.trumpSuit = null;
        this.makerIndex = null;
        this.alone = false;

        this.table = []; // { playerIndex, card }
        this.talon = [];
        this.faceUpCard = null;

        this.team1Score = 0; // Team 1: West & East (0 & 2)
        this.team2Score = 0; // Team 2: North & You (1 & 3)
        this.team1Tricks = 0;
        this.team2Tricks = 0;
    }

    createDeck() {
        const deck = [];
        for (const suit of Object.values(SUITS)) {
            for (const rank of Object.values(RANKS)) {
                deck.push({ suit, rank });
            }
        }
        return deck;
    }

    shuffle(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    deal() {
        logAction(`Dealer is ${this.players[this.dealerIndex].name}. Dealing...`);
        const deck = this.shuffle(this.createDeck());
        this.players.forEach(p => {
            p.hand = [];
            p.tricks = 0;
        });
        for (let i = 0; i < 5; i++) {
            for (let p = 0; p < 4; p++) {
                this.players[p].hand.push(deck.pop());
            }
        }
        this.talon = deck;
        this.faceUpCard = this.talon[0];
        this.phase = PHASES.BIDDING_ROUND_1;
        this.currentPlayerIndex = (this.dealerIndex + 1) % 4;
        this.table = [];
        this.trumpSuit = null;
    }

    handleAction(action, data) {
        console.log(`Action: ${action}`, data);
        const player = this.players[this.currentPlayerIndex];

        if (this.phase === PHASES.BIDDING_ROUND_1) {
            if (action === 'ORDER_UP') {
                logAction(`${player.name} ordered up ${this.faceUpCard.rank} of ${this.faceUpCard.suit}.`);
                this.trumpSuit = this.faceUpCard.suit;
                this.makerIndex = this.currentPlayerIndex;
                this.phase = PHASES.DISCARDING;
                this.currentPlayerIndex = this.dealerIndex;
                // Dealer picks up the card
                this.players[this.dealerIndex].hand.push(this.faceUpCard);
            } else if (action === 'PASS') {
                logAction(`${player.name} passed.`);
                if (this.currentPlayerIndex === this.dealerIndex) {
                    this.phase = PHASES.BIDDING_ROUND_2;
                }
                this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 4;
            }
        } else if (this.phase === PHASES.BIDDING_ROUND_2) {
            if (action === 'PICK_SUIT') {
                logAction(`${player.name} picked ${data.toUpperCase()}.`);
                this.trumpSuit = data;
                this.makerIndex = this.currentPlayerIndex;
                this.startPlaying();
            } else if (action === 'PASS') {
                logAction(`${player.name} passed.`);
                if (this.currentPlayerIndex === this.dealerIndex) {
                    logAction(`Everyone passed. Re-dealing...`);
                    this.dealerIndex = (this.dealerIndex + 1) % 4;
                    this.deal();
                } else {
                    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 4;
                }
            }
        } else if (this.phase === PHASES.DISCARDING) {
            if (action === 'DISCARD') {
                const dealer = this.players[this.dealerIndex];
                logAction(`${dealer.name} discarded a card.`);
                dealer.hand.splice(data, 1);
                this.startPlaying();
            }
        } else if (this.phase === PHASES.PLAYING) {
            if (action === 'PLAY_CARD') {
                if (this.isValidPlay(this.currentPlayerIndex, data)) {
                    const card = player.hand[data];
                    logAction(`${player.name} played ${card.rank} of ${card.suit}.`);
                    this.playCard(this.currentPlayerIndex, data);
                } else {
                    if (player.type === 'HUMAN') {
                        alert("Invalid play! You must follow suit if possible.");
                    }
                    console.warn("Invalid play: Must follow suit.");
                }
            }
        }
    }

    isValidPlay(playerIndex, cardIndex) {
        const player = this.players[playerIndex];
        const card = player.hand[cardIndex];

        if (this.table.length === 0) return true;

        const ledSuit = this.getEffectiveSuit(this.table[0].card);
        const cardSuit = this.getEffectiveSuit(card);

        if (cardSuit === ledSuit) return true;

        // If not following suit, check if player has any cards of the led suit
        const hasLedSuit = player.hand.some(c => this.getEffectiveSuit(c) === ledSuit);
        return !hasLedSuit;
    }

    startPlaying() {
        this.phase = PHASES.PLAYING;
        this.currentPlayerIndex = (this.dealerIndex + 1) % 4;
        this.team1Tricks = 0;
        this.team2Tricks = 0;
        this.players.forEach(p => p.tricks = 0);
        this.table = [];
    }

    playCard(playerIndex, cardIndex) {
        const player = this.players[playerIndex];
        const card = player.hand.splice(cardIndex, 1)[0];
        this.table.push({ playerIndex, card });

        if (this.table.length === 4) {
            this.currentPlayerIndex = -1; // Nobody's turn while resolving
        } else {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 4;
        }
    }

    resolveTrick() {
        if (this.table.length < 4) return;

        const winnerIndex = this.getTrickWinner();
        const winnerName = this.players[winnerIndex].name;
        logAction(`${winnerName} wins the trick.`);

        this.players[winnerIndex].tricks++;
        if (winnerIndex === 0 || winnerIndex === 2) this.team1Tricks++;
        else this.team2Tricks++;

        this.table = [];
        this.currentPlayerIndex = winnerIndex;

        if (this.players[0].hand.length === 0) {
            this.phase = PHASES.SCORING;
        }
    }

    getTrickWinner() {
        const ledCard = this.table[0].card;
        const ledSuit = this.getEffectiveSuit(ledCard);
        let bestPlay = this.table[0];

        for (let i = 1; i < 4; i++) {
            if (this.isBetter(this.table[i].card, bestPlay.card, ledSuit)) {
                bestPlay = this.table[i];
            }
        }
        return bestPlay.playerIndex;
    }

    getEffectiveSuit(card) {
        if (card.rank === RANKS.JACK) {
            if (this.trumpSuit === SUITS.SPADES && card.suit === SUITS.CLUBS) return SUITS.SPADES;
            if (this.trumpSuit === SUITS.CLUBS && card.suit === SUITS.SPADES) return SUITS.CLUBS;
            if (this.trumpSuit === SUITS.HEARTS && card.suit === SUITS.DIAMONDS) return SUITS.HEARTS;
            if (this.trumpSuit === SUITS.DIAMONDS && card.suit === SUITS.HEARTS) return SUITS.DIAMONDS;
        }
        return card.suit;
    }

    isBetter(card, bestSoFar, ledSuit) {
        const cSuit = this.getEffectiveSuit(card);
        const bSuit = this.getEffectiveSuit(bestSoFar);

        if (cSuit === this.trumpSuit && bSuit !== this.trumpSuit) return true;
        if (cSuit !== this.trumpSuit && bSuit === this.trumpSuit) return false;

        if (cSuit === this.trumpSuit && bSuit === this.trumpSuit) {
            return this.getCardValue(card) > this.getCardValue(bestSoFar);
        }

        if (cSuit === ledSuit && bSuit !== ledSuit) return true;
        if (cSuit !== ledSuit && bSuit === ledSuit) return false;

        if (cSuit === ledSuit && bSuit === ledSuit) {
            return this.getCardValue(card) > this.getCardValue(bestSoFar);
        }

        return false;
    }

    getCardValue(card) {
        const values = { '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };
        if (card.rank === RANKS.JACK) {
            if (card.suit === this.trumpSuit) return 20; // Right Bower
            if (this.isLeftBower(card)) return 19; // Left Bower
        }
        return values[card.rank];
    }

    isLeftBower(card) {
        if (card.rank !== RANKS.JACK) return false;
        if (this.trumpSuit === SUITS.SPADES) return card.suit === SUITS.CLUBS;
        if (this.trumpSuit === SUITS.CLUBS) return card.suit === SUITS.SPADES;
        if (this.trumpSuit === SUITS.HEARTS) return card.suit === SUITS.DIAMONDS;
        if (this.trumpSuit === SUITS.DIAMONDS) return card.suit === SUITS.HEARTS;
        return false;
    }

    resolveHand() {
        const makerTeam = (this.makerIndex === 0 || this.makerIndex === 2) ? 1 : 2;
        const tricks = makerTeam === 1 ? this.team1Tricks : this.team2Tricks;

        if (tricks === 5) {
            if (makerTeam === 1) this.team1Score += 2;
            else this.team2Score += 2;
        } else if (tricks >= 3) {
            if (makerTeam === 1) this.team1Score += 1;
            else this.team2Score += 1;
        } else {
            // Euchred!
            if (makerTeam === 1) this.team2Score += 2;
            else this.team1Score += 2;
        }

        if (this.team1Score >= 10 || this.team2Score >= 10) {
            this.phase = PHASES.END_OF_GAME;
        } else {
            this.dealerIndex = (this.dealerIndex + 1) % 4;
            this.deal();
        }
    }

    aiTurn() {
        const player = this.players[this.currentPlayerIndex];
        if (this.phase === PHASES.BIDDING_ROUND_1) {
            const count = player.hand.filter(c => this.getEffectiveSuit(c) === this.faceUpCard.suit).length;
            // AI orders up if they have 3+ of the suit (counting bower) or 2+ if they are the dealer
            const threshold = (this.currentPlayerIndex === this.dealerIndex) ? 2 : 3;
            if (count >= threshold) this.handleAction('ORDER_UP');
            else this.handleAction('PASS');
        } else if (this.phase === PHASES.BIDDING_ROUND_2) {
            let picked = false;
            // Don't pick the suit that was turned down
            const forbiddenSuit = this.faceUpCard.suit;

            // Try to pick a suit where we have 2+ cards
            for (const suit of Object.values(SUITS)) {
                if (suit === forbiddenSuit) continue;
                // Temporarily set trumpSuit to count effective suit
                const oldTrump = this.trumpSuit;
                this.trumpSuit = suit;
                const count = player.hand.filter(c => this.getEffectiveSuit(c) === suit).length;
                this.trumpSuit = oldTrump;

                if (count >= 2) {
                    this.handleAction('PICK_SUIT', suit);
                    picked = true;
                    break;
                }
            }
            if (!picked) {
                // Dealer must pick if "stick the dealer" (optional, but let's say they pick their best)
                if (this.currentPlayerIndex === this.dealerIndex) {
                    let bestSuit = Object.values(SUITS).find(s => s !== forbiddenSuit);
                    this.handleAction('PICK_SUIT', bestSuit);
                } else {
                    this.handleAction('PASS');
                }
            }
        } else if (this.phase === PHASES.DISCARDING) {
            // Discard the lowest non-trump card
            let lowestIndex = 0;
            let lowestValue = 1000;
            player.hand.forEach((c, i) => {
                const val = this.getCardValue(c);
                if (val < lowestValue) {
                    lowestValue = val;
                    lowestIndex = i;
                }
            });
            this.handleAction('DISCARD', lowestIndex);
        } else if (this.phase === PHASES.PLAYING) {
            // Very simple AI: play first legal card
            let cardIndex = 0;
            for (let i = 0; i < player.hand.length; i++) {
                if (this.isValidPlay(this.currentPlayerIndex, i)) {
                    cardIndex = i;
                    break;
                }
            }
            this.handleAction('PLAY_CARD', cardIndex);
        }
    }
}

class Renderer {
    constructor(game) {
        this.game = game;
        this.handContainers = {
            0: document.getElementById('hand-west'),
            1: document.getElementById('hand-north'),
            2: document.getElementById('hand-east'),
            3: document.getElementById('hand-south')
        };
        this.trickSlots = {
            0: document.getElementById('trick-west'),
            1: document.getElementById('trick-north'),
            2: document.getElementById('trick-east'),
            3: document.getElementById('trick-south')
        };
        this.nameElements = {
            0: document.getElementById('name-west'),
            1: document.getElementById('name-north'),
            2: document.getElementById('name-east'),
            3: document.getElementById('name-south')
        };
        this.talonArea = document.getElementById('talon-area');
        this.statusEl = document.getElementById('status');
        this.team1ScoreEl = document.getElementById('team1-score');
        this.team2ScoreEl = document.getElementById('team2-score');
        this.controlsEl = document.getElementById('controls');
        this.biddingControlsEl = document.getElementById('bidding-controls');
    }

    getCardImagePath(card, flippedUp = true) {
        if (!flippedUp) return 'images/Cards/back.svg';
        return `images/Cards/${card.suit}${card.rank}.svg`;
    }

    createCardImage(card, flippedUp = true, sizeClass = 'w-16', isPlayable = false) {
        const img = document.createElement('img');
        img.src = this.getCardImagePath(card, flippedUp);
        img.className = `card-img ${sizeClass}`;
        if (isPlayable) {
            img.classList.add('cursor-pointer', 'ring-2', 'ring-yellow-400', 'hover:scale-110');
        }
        img.alt = flippedUp ? `${card.rank} of ${card.suit}` : 'Card Back';
        return img;
    }

    render() {
        this.renderHands();
        this.renderTable();
        this.renderTalon();
        this.renderScore();
        this.renderStatus();
        this.renderControls();
        this.renderNames();
    }

    renderHands() {
        this.game.players.forEach((player, index) => {
            const container = this.handContainers[index];
            if (!container) return;
            container.innerHTML = '';

            const isHuman = player.type === 'HUMAN';
            const sizeClass = isHuman ? 'w-24' : 'w-16';

            player.hand.forEach((card, cardIndex) => {
                let isPlayable = false;
                if (isHuman) {
                    if (this.game.phase === PHASES.DISCARDING && this.game.dealerIndex === 3) {
                        isPlayable = true;
                    } else if (this.game.phase === PHASES.PLAYING && this.game.currentPlayerIndex === 3) {
                        isPlayable = this.game.isValidPlay(3, cardIndex);
                    }
                }

                const cardImg = this.createCardImage(card, isHuman, sizeClass, isPlayable);
                if (isHuman) {
                    cardImg.onclick = () => {
                        if (this.game.phase === PHASES.DISCARDING && this.game.dealerIndex === 3) {
                            handleUserAction('DISCARD', cardIndex);
                        } else if (this.game.phase === PHASES.PLAYING && this.game.currentPlayerIndex === 3) {
                            handleUserAction('PLAY_CARD', cardIndex);
                        }
                    };
                }
                container.appendChild(cardImg);
            });
        });
    }

    renderTable() {
        Object.values(this.trickSlots).forEach(slot => {
            if (slot) slot.innerHTML = '';
        });

        const table = this.game.table;
        table.forEach((play, index) => {
            const slot = this.trickSlots[play.playerIndex];
            if (slot) {
                const cardImg = this.createCardImage(play.card, true, 'w-20');
                // Only animate the most recently played card
                if (index === table.length - 1) {
                    cardImg.classList.add('trick-card-animate');
                }
                slot.appendChild(cardImg);
            }
        });
    }

    renderTalon() {
        if (!this.talonArea) return;
        this.talonArea.innerHTML = '';

        if (this.game.phase === PHASES.BIDDING_ROUND_1 && this.game.faceUpCard) {
            const cardImg = this.createCardImage(this.game.faceUpCard, true, 'w-20');
            this.talonArea.appendChild(cardImg);
        } else if (this.game.phase === PHASES.BIDDING_ROUND_2 || this.game.phase === PHASES.DEALING) {
            const cardImg = this.createCardImage(null, false, 'w-20');
            this.talonArea.appendChild(cardImg);
        }
    }

    renderScore() {
        if (this.team1ScoreEl) this.team1ScoreEl.textContent = this.game.team1Score;
        if (this.team2ScoreEl) this.team2ScoreEl.textContent = this.game.team2Score;
    }

    renderStatus() {
        if (!this.statusEl) return;

        if (this.game.phase === PHASES.END_OF_GAME) {
            const winner = this.game.team1Score >= 10 ? "Team 1 (Computers)" : "Team 2 (You & Partner)";
            this.statusEl.textContent = `Game Over! ${winner} wins!`;
            return;
        }

        if (this.game.phase === PHASES.SCORING) {
            this.statusEl.textContent = "Hand Over. Check the scores!";
            return;
        }

        const currentPlayer = this.game.players[this.game.currentPlayerIndex];
        const isHumanTurn = currentPlayer && currentPlayer.type === 'HUMAN';

        switch (this.game.phase) {
            case PHASES.BIDDING_ROUND_1:
                this.statusEl.textContent = isHumanTurn ?
                    `Your turn. Order up ${this.game.faceUpCard.rank} of ${this.game.faceUpCard.suit}?` :
                    `${currentPlayer.name} is deciding...`;
                break;
            case PHASES.BIDDING_ROUND_2:
                this.statusEl.textContent = isHumanTurn ?
                    `Your turn. Pick a trump suit or pass.` :
                    `${currentPlayer.name} is deciding...`;
                break;
            case PHASES.DISCARDING:
                const dealer = this.game.players[this.game.dealerIndex];
                this.statusEl.textContent = (this.game.dealerIndex === 3) ?
                    "You are the dealer. Pick a card to discard." :
                    `${dealer.name} is discarding...`;
                break;
            case PHASES.PLAYING:
                if (isHumanTurn) {
                    this.statusEl.textContent = "Your turn to play a card.";
                } else if (currentPlayer) {
                    this.statusEl.textContent = `${currentPlayer.name}'s turn.`;
                } else {
                    this.statusEl.textContent = "Resolving trick...";
                }
                break;
            default:
                this.statusEl.textContent = `Phase: ${this.game.phase}`;
        }

        if (this.game.trumpSuit) {
            const trumpDisplay = document.createElement('div');
            trumpDisplay.className = "mt-2 font-bold flex items-center";
            trumpDisplay.innerHTML = `Trump: <img src="images/Suits/${this.game.trumpSuit.charAt(0).toUpperCase() + this.game.trumpSuit.slice(1)}.png" class="w-4 h-4 mx-1"> ${this.game.trumpSuit.toUpperCase()}`;
            this.statusEl.appendChild(trumpDisplay);
        }
    }

    renderNames() {
        this.game.players.forEach((player, index) => {
            const el = this.nameElements[index];
            if (!el) return;

            const dealerSymbol = index === this.game.dealerIndex ? '▲ ' : '';
            const trickSymbols = ' ■'.repeat(player.tricks || 0);
            const partnerSuffix = (index === 1) ? ' (Partner)' : '';

            // Clear element and rebuild safely
            el.textContent = '';

            if (this.game.trumpSuit && index === this.game.makerIndex) {
                const suitName = this.game.trumpSuit.charAt(0).toUpperCase() + this.game.trumpSuit.slice(1);
                const img = document.createElement('img');
                img.src = `images/Suits/${suitName}.png`;
                img.className = "w-4 h-4 inline-block mr-1";
                el.appendChild(img);
            }

            const nameText = document.createTextNode(`${dealerSymbol}${player.name}${partnerSuffix}${trickSymbols}`);
            el.appendChild(nameText);

            // Highlight current player
            if (index === this.game.currentPlayerIndex) {
                el.classList.add('ring-4', 'ring-yellow-400', 'ring-opacity-75');
            } else {
                el.classList.remove('ring-4', 'ring-yellow-400', 'ring-opacity-75');
            }
        });
    }

    renderControls() {
        if (this.controlsEl) this.controlsEl.innerHTML = '';
        if (this.biddingControlsEl) this.biddingControlsEl.innerHTML = '';

        if (this.game.phase === PHASES.SCORING) {
            return;
        }

        if (this.game.phase === PHASES.END_OF_GAME) {
            const restartBtn = document.createElement('button');
            restartBtn.className = "w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded shadow mb-2";
            restartBtn.textContent = "New Game";
            restartBtn.onclick = () => {
                this.game.reset();
                this.game.deal();
                this.render();
                checkAITurn();
            };
            this.controlsEl.appendChild(restartBtn);
            return;
        }

        const currentPlayer = this.game.players[this.game.currentPlayerIndex];
        if (!currentPlayer || currentPlayer.type !== 'HUMAN') return;

        if (this.game.phase === PHASES.BIDDING_ROUND_1) {
            if (!this.biddingControlsEl) return;
            const orderBtn = document.createElement('button');
            orderBtn.className = "bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded shadow text-sm transition-all transform hover:scale-105";
            orderBtn.textContent = "Order Up";
            orderBtn.onclick = () => handleUserAction('ORDER_UP');

            const passBtn = document.createElement('button');
            passBtn.className = "bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded shadow text-sm transition-all transform hover:scale-105";
            passBtn.textContent = "Pass";
            passBtn.onclick = () => handleUserAction('PASS');

            this.biddingControlsEl.appendChild(orderBtn);
            this.biddingControlsEl.appendChild(passBtn);
        } else if (this.game.phase === PHASES.BIDDING_ROUND_2) {
            if (!this.biddingControlsEl) return;
            Object.values(SUITS).forEach(suit => {
                if (suit === this.game.faceUpCard.suit) return;
                const suitBtn = document.createElement('button');
                suitBtn.className = "bg-white hover:bg-gray-100 text-gray-800 font-bold py-1 px-2 rounded shadow border flex items-center justify-center text-xs transition-all transform hover:scale-105";
                suitBtn.innerHTML = `<img src="images/Suits/${suit.charAt(0).toUpperCase() + suit.slice(1)}.png" class="w-3 h-3 mr-1"> ${suit.toUpperCase()}`;
                suitBtn.onclick = () => handleUserAction('PICK_SUIT', suit);
                this.biddingControlsEl.appendChild(suitBtn);
            });

            const passBtn = document.createElement('button');
            passBtn.className = "bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded shadow text-sm transition-all transform hover:scale-105";
            passBtn.textContent = "Pass";
            passBtn.onclick = () => handleUserAction('PASS');
            this.biddingControlsEl.appendChild(passBtn);
        }
    }
}

let game;
let renderer;
let aiTimeout = null;

function logAction(message) {
    const logEl = document.getElementById('game-log');
    if (!logEl) return;
    const entry = document.createElement('div');
    entry.className = "border-b border-gray-100 pb-1";
    entry.textContent = `> ${message}`;
    logEl.appendChild(entry);
    logEl.scrollTop = logEl.scrollHeight;
}

async function handleUserAction(action, data) {
    game.handleAction(action, data);
    renderer.render();
    checkAITurn();
}

async function checkAITurn() {
    if (aiTimeout) return;

    if (game.phase === PHASES.PLAYING && game.table.length === 4) {
        aiTimeout = setTimeout(() => {
            game.resolveTrick();
            renderer.render();
            aiTimeout = null;
            checkAITurn();
        }, 2000);
        return;
    }

    if (game.phase === PHASES.SCORING) {
        aiTimeout = setTimeout(() => {
            game.resolveHand();
            renderer.render();
            aiTimeout = null;
            checkAITurn();
        }, 4000);
        return;
    }

    const currentPlayer = game.players[game.currentPlayerIndex];
    if (currentPlayer && currentPlayer.type === 'AI' && game.phase !== PHASES.END_OF_GAME) {
        aiTimeout = setTimeout(() => {
            game.aiTurn();
            renderer.render();
            aiTimeout = null;
            checkAITurn();
        }, 1500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    game = new GameState();
    renderer = new Renderer(game);
    game.deal();
    renderer.render();
    checkAITurn();

    window.game = game;
    window.renderer = renderer;

    const sidebar = document.getElementById('sidebar');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeBtn = document.getElementById('close-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    function toggleSidebar(show) {
        if (show) {
            sidebar.classList.add('open');
            overlay.classList.add('show');
        } else {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        }
    }

    if (hamburgerBtn) hamburgerBtn.addEventListener('click', () => toggleSidebar(true));
    if (closeBtn) closeBtn.addEventListener('click', () => toggleSidebar(false));
    if (overlay) overlay.addEventListener('click', () => toggleSidebar(false));

    const resetBtn = document.getElementById('reset-game-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to reset the game? Current progress will be lost.")) {
                const logEl = document.getElementById('game-log');
                if (logEl) logEl.innerHTML = '<div>Game Reset.</div>';
                game.reset();
                game.deal();
                renderer.render();
                checkAITurn();
            }
        });
    }
});
