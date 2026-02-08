# Euchre Interactivity TODOs

This document outlines the steps needed to convert the static UI into a fully functional Vanilla JS Euchre game.

## 1. Game State Management
- [x] Define a robust state object to track:
    - [x] Current player turn
    - [x] Dealer position
    - [x] Hands of all players
    - [x] Cards on the table
    - [x] Current phase (Dealing, Bidding, Discarding, Playing, Scoring)
    - [x] Trump suit
    - [x] Scores and tricks taken

## 2. Rendering Engine
- [ ] Create functions to dynamically render:
    - Player hands based on state
    - Cards played to the table
    - Scoreboard updates
    - Game status messages
    - Dynamic control buttons based on the current phase

## 3. Game Logic
- [ ] **Deck & Dealing**:
    - [x] Implement a deck of 24 cards (9, 10, J, Q, K, A of each suit).
    - [x] Implement shuffling and dealing 5 cards to each player.
- [ ] **Bidding Phase**:
    - Handle "Order Up" and "Pass" for the first round.
    - Handle "Calling Trump" for the second round.
    - Implement "Alone" option.
- [ ] **Trick Playing**:
    - Enforce following suit.
    - Determine trick winner (including Trump logic and Left Bower).
    - Handle lead transitions.
- [ ] **Scoring**:
    - Calculate points at the end of each hand (1, 2, or 4 points).
    - Detect end-of-game (first to 10 points).

## 4. AI Strategy
- [ ] Port the existing AI logic from `ComputerPlayer.tsx` and `computer-player/index.ts` to Vanilla JS.
- [ ] Implement decision-making for bidding and card selection.

## 5. User Interaction
- [ ] Add event listeners to cards for playing.
- [ ] Add event listeners to control buttons.
- [ ] Add animations for card movements (optional but nice).

## 6. Assets & Cleanup
- [ ] Optimize image loading if necessary.
- [ ] Ensure full responsiveness for mobile devices.
