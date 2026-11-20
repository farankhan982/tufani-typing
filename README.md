# Tufani Typing

Tufani Typing is a browser-based typing RPG where accuracy and speed determine how quickly you defeat enemies. Create a warrior profile, choose an avatar, and battle through 100 progressively challenging levels.

## Features

- 100 unique typing levels with increasing speed targets
- Boss battles every 10 levels
- Multiple enemies and hero avatars
- Live WPM, accuracy, timer, health, and combo tracking
- Three-star rating system
- Best WPM and earned stars saved in your browser
- Sound effects and victory confetti
- Responsive interface for desktop and mobile browsers
- Local profile and progress, with no account or backend required

## How to Play

1. Open the game in a browser.
2. Enter a warrior name and choose an avatar.
3. Press **Play Now** or select a level from the level map.
4. Type the glowing sentence exactly as shown.
5. Each correct character deals 10 HP damage to the enemy.
6. Each mistake resets the combo and removes HP from the hero.
7. Complete the sentence before the timer expires and before your health reaches zero.

## Scoring and Stars

Every cleared level earns at least one star:

- **Star 1 — Completion:** Defeat the enemy and complete the level.
- **Star 2 — Accuracy:** Finish with at least 95% accuracy.
- **Star 3 — Speed:** Reach or exceed the level's target WPM.

The maximum score is 300 stars across 100 levels. Level targets increase from 15 WPM to 75 WPM. Clearing a level unlocks the next level.

## Run Locally

This project uses plain HTML, CSS, and JavaScript, so no package installation is required.

### Option 1: Open directly

Open `index.html` in a modern browser.

### Option 2: Use a local server

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

You can also use VS Code Live Server or any other static file server.

## Project Structure

```text
.
├── index.html    # Game interface and modal screens
├── style.css     # Layout, responsive design, and animations
├── script.js     # Levels, gameplay, battle mechanics, and saving
└── README.md     # Project documentation
```

## Browser Storage

The game stores the following data in `localStorage`:

- Player name
- Selected avatar
- Highest unlocked level
- Earned stars
- Best WPM for each level

Use **Reset Progress** on the level map to clear saved profile and game data.

## Controls

- **Keyboard:** Type the displayed sentence
- **Spacebar:** Included as part of the text when shown
- **Back to Menu / Map:** Leave the current battle
- **Replay:** Restart the current level
- **Next Level:** Continue after a victory
- **Sound:** Toggle game audio

## Compatibility

Use an up-to-date browser such as Chrome, Edge, Firefox, or Safari. The game requires JavaScript and uses the Web Audio API for sound effects.

## License

No license has been specified for this project. All rights remain with the repository owner unless an open-source license is added.
