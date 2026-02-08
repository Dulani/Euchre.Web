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
            { name: 'Computer 1', type: 'AI', hand: [] },
            { name: 'Computer 2', type: 'AI', hand: [] }, // Partner
            { name: 'Computer 3', type: 'AI', hand: [] },
            { name: 'You', type: 'HUMAN', hand: [] }
        ];
        this.dealerIndex = Math.floor(Math.random() * 4);
        this.currentPlayerIndex = (this.dealerIndex + 1) % 4;
        this.trumpSuit = null;
        this.makerIndex = null;
        this.alone = false;

        this.table = [];
        this.talon = [];
        this.faceUpCard = null;

        this.team1Score = 0;
        this.team2Score = 0;
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
        const deck = this.shuffle(this.createDeck());

        // Clear hands
        this.players.forEach(p => p.hand = []);

        // Deal 5 cards to each player
        for (let i = 0; i < 5; i++) {
            for (let p = 0; p < 4; p++) {
                this.players[p].hand.push(deck.pop());
            }
        }

        // Remaining 4 cards are the talon
        this.talon = deck;
        this.faceUpCard = this.talon[0];

        this.phase = PHASES.BIDDING_ROUND_1;
        this.currentPlayerIndex = (this.dealerIndex + 1) % 4;
    }

    nextTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 4;
    }

    setPhase(phase) {
        this.phase = phase;
    }
}

// Global game instance
let game;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Euchre game initialized');

    game = new GameState();
    game.deal();
    window.game = game; // For debugging
    console.log('Initial Game State:', game);

    // Sidebar Toggle Logic
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggle-sidebar');
    const showBtn = document.getElementById('show-sidebar');

    if (toggleBtn && showBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.add('collapsed');
            showBtn.classList.remove('hidden');
        });

        showBtn.addEventListener('click', () => {
            sidebar.classList.remove('collapsed');
            showBtn.classList.add('hidden');
        });
    }
});
