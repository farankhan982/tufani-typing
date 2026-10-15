/* =====================================================================
   TUFANI TYPING - AVATAR & PROFILE EDITION (script.js)
   ===================================================================== */

// ==================== 1. SOUND ENGINE (Web Audio API) ====================
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playTone(freq, type, duration, vol = 0.08) {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    hit() {
        this.playTone(520, 'triangle', 0.07, 0.06);
        setTimeout(() => this.playTone(780, 'sine', 0.05, 0.04), 25);
    }

    hurt() {
        this.playTone(130, 'sawtooth', 0.22, 0.14);
        setTimeout(() => this.playTone(95, 'square', 0.2, 0.12), 50);
    }

    starPop(index) {
        const notes = [523.25, 659.25, 783.99];
        this.playTone(notes[index - 1] || 880, 'sine', 0.28, 0.12);
    }

    win() {
        const melody = [440, 554.37, 659.25, 880];
        melody.forEach((f, i) => {
            setTimeout(() => this.playTone(f, 'triangle', 0.25, 0.12), i * 110);
        });
    }

    lose() {
        const melody = [300, 260, 220, 150];
        melody.forEach((f, i) => {
            setTimeout(() => this.playTone(f, 'sawtooth', 0.3, 0.12), i * 140);
        });
    }
}

const sfx = new SoundEngine();

// ==================== 2. AVATAR ROSTER (Male & Female Heroes) ====================
const HERO_AVATARS = [
    "🥷", "🧙‍♂️", "🛡️", "⚔️", "🧙‍♀️", "🧝‍♀️", "🦸‍♂️", "🦸‍♀️", "🦾", "👑", "🔥", "⚡", "🦊", "🐯", "🦁", "🐉"
];

let selectedAvatar = "🥷";

// ==================== 3. 100 UNIQUE LEVELS ENGINE ====================
const ENEMY_ROSTER = [
    { name: "SHADOW BOT", emoji: "👾" },
    { name: "CYBER DRONE", emoji: "🤖" },
    { name: "VENOM SPIDER", emoji: "🕷️" },
    { name: "FIRE IMP", emoji: "👺" },
    { name: "NEON PHANTOM", emoji: "👻" },
    { name: "FROST GOLEM", emoji: "🥶" },
    { name: "THUNDER BEAST", emoji: "🦖" },
    { name: "DARK NINJA", emoji: "🥷" },
    { name: "MUTANT ALIEN", emoji: "👽" },
    { name: "OMEGA TUFAN BOSS", emoji: "🐉" }
];

function getUniqueSentence(lvl) {
    const templates = [
        /* 1 */  `Type as fast as {lightning} to defeat the enemy & protect your health bar!`,
        /* 2 */  `Your speed [WPM] must cross 20 => to unlock the first victory star!`,
        /* 3 */  `Never make a mistake {0}; otherwise the monster will strike you back immediately!`,
        /* 4 */  `Keep your fingers steady on [home row] keys && maintain high accuracy.`,
        /* 5 */  `The battle arena glows with {neon} energy as you type every single letter correctly.`,
        /* 6 */  `Check your health bar [100 HP] before the enemy launches a counter attack.`,
        /* 7 */  `Focus on precision {100%} rather than rushing blindly into the digital storm.`,
        /* 8 */  `Press spacebar to trigger {combo} multipliers and deal massive damage!`,
        /* 9 */  `Level 9 protocol [active]: defeat the drone before the countdown timer hits zero.`,
        /* 10 */ `[BOSS LEVEL 10]: The giant shadow bot awakens! Strike with absolute fury {⚡}.`,
        
        /* 11 */ `Swift movement and calm breathing defeat the toughest enemies in {combat}.`,
        /* 12 */ `The timer is ticking down [tick-tock] => stay calm and keep typing smoothly.`,
        /* 13 */ `Every correct keystroke {+10} sends a powerful electric beam toward the foe.`,
        /* 14 */ `Mistakes give the monster an opening [trap] to damage your shield!`,
        /* 15 */ `Achieve a high speed target [30 WPM] to earn your second golden star ⭐.`,
        /* 16 */ `Digital warriors train their reflexes {daily} inside the virtual battle grid.`,
        /* 17 */ `Channel your inner energy && unleash an unstoppable typing combo streak!`,
        /* 18 */ `The drone fires a red laser [⚠️] whenever you misspell a character.`,
        /* 19 */ `Victory belongs to the player who combines speed {WPM} with perfect accuracy.`,
        /* 20 */ `[BOSS LEVEL 20]: Cyber Drone Mk-2 activates heavy armor! Break through {🛡️}.`,

        /* 21 */ `Programming your brain for speed requires consistent daily practice {code && play}.`,
        /* 22 */ `The venom spider crawls closer [🕷️] as seconds slip away from the clock.`,
        /* 23 */ `Maintain a steady rhythm [1-2-3] to keep your combo multiplier safe from resets.`,
        /* 24 */ `A true gamer never looks down at the keyboard during an epic {boss} fight.`,
        /* 25 */ `Unlock the 3-star rating [⭐⭐️⭐] by mastering both time limits and accuracy.`,
        /* 26 */ `Electrical sparks fly across the screen {✨} with every flawless word you complete.`,
        /* 27 */ `Guard your remaining health points [HP] like your life depends on this match!`,
        /* 28 */ `The storm grows much stronger {🌩️} as you climb higher up the cyber tower.`,
        /* 29 */ `Execute quick finger motions => to outsmart the cunning neon phantom enemy.`,
        /* 30 */ `[BOSS LEVEL 30]: Fire Imp unleashes blazing inferno waves across the arena {🔥}.`,

        /* 31 */ `Advanced typing techniques involve looking ahead at upcoming words [next].`,
        /* 32 */ `The frost golem freezes time [❄️] if your typing speed drops too low.`,
        /* 33 */ `Stay focused on the glowing cursor {📍} to avoid making costly mistakes.`,
        /* 34 */ `Your keyboard is your ultimate weapon [⚔️] in this high-speed digital war.`,
        /* 35 */ `Calculate your words per minute [WPM] accurately to measure your true skill.`,
        /* 36 */ `The thunder beast roars loudly [🦖] whenever you trigger a combo streak.`,
        /* 37 */ `Practice makes perfect {💯} when trying to conquer all one hundred levels.`,
        /* 38 */ `Dark ninja strikes from the shadows [🥷]—type quickly to reveal his location!`,
        /* 39 */ `High performance requires zero lag [0ms] between your brain and your fingers.`,
        /* 40 */ `[BOSS LEVEL 40]: Frost Golem unleashes absolute zero blizzard waves {❄️}.`,

        /* 41 */ `Mutant alien signals detected [👽]! Transmit the correct decryption sequence.`,
        /* 42 */ `Speed and accuracy combine together [50 WPM && 95% Acc] for ultimate victory.`,
        /* 43 */ `Never panic when the health bar drops low [⚠️]; stay cool and counterattack!`,
        /* 44 */ `The arena floor shakes violently [ earthquake ] as powerful attacks collide.`,
        /* 45 */ `Unlock new stages on the map grid {🗺️} after defeating each level boss.`,
        /* 46 */ `Your typing stamina is being tested to the absolute limit {⚡} right now.`,
        /* 47 */ `Defeat the mechanical enemies using swift fingers and smart strategies [🧠].`,
        /* 48 */ `The system status reads {ONLINE}—ready for high speed typing combat!`,
        /* 49 */ `Push past your previous speed records [WPM] to establish total dominance.`,
        /* 50 */ `[BOSS LEVEL 50]: Thunder Beast unleashes 10,000 volts of pure lightning {⚡}.`,

        /* 51 */ `Entering Tier 3 difficulty [Levels 51-80]: Sentences become longer and tougher.`,
        /* 52 */ `The cybernetic guardian protects the gateway {🚪} with impenetrable shields.`,
        /* 53 */ `Sharp eyes and nimble fingers {👀🖐️} are the hallmarks of a typing master.`,
        /* 54 */ `Every millisecond counts [⏱️] when racing against the countdown timer.`,
        /* 55 */ `Overcome obstacles and rise above mistakes {📈} to achieve legendary status.`,
        /* 56 */ `The enemy monster prepares a heavy counter strike [💥]—brace yourself!`,
        /* 57 */ `Maintain absolute concentration {🎯} through every single character typed.`,
        /* 58 */ `The neon lights flicker in the arena {💡} as the battle reaches its peak.`,
        /* 59 */ `Power up your attacks {🚀} by sustaining an unbroken chain of correct hits.`,
        /* 60 */ `[BOSS LEVEL 60]: Dark Ninja unleashes shadow clone multi-strikes {👥}.`,

        /* 61 */ `Elite coders and typists share the rare ability {✨} of effortless flow state.`,
        /* 62 */ `The battle simulation runs at maximum capacity [100%] in the main mainframe.`,
        /* 63 */ `Guard your hit points carefully [HP > 0] to prevent an immediate game over.`,
        /* 64 */ `Type through the digital blizzard {❄️} and emerge victorious on the other side.`,
        /* 65 */ `Achieve milestone achievements {🏆} to prove your dedication to the game.`,
        /* 66 */ `The countdown clock ticks faster [tick...tock...] as pressure mounts up.`,
        /* 67 */ `Unleash secret typing combos {🔥} to obliterate stubborn enemy defenses.`,
        /* 68 */ `Victory is earned through discipline, focus, and relentless daily practice {💪}.`,
        /* 69 */ `The final trials of the cyber arena {🏟️} demand your absolute best effort.`,
        /* 70 */ `[BOSS LEVEL 70]: Mutant Alien deploys plasma laser cannons {🛸}.`,

        /* 71 */ `Complex text patterns test your agility {🤸‍♂️} across difficult keyboard layouts.`,
        /* 72 */ `Keep pushing forward through every typo {❌} without losing your rhythm.`,
        /* 73 */ `The legendary typing scrolls contain ancient secrets of unmatched velocity {📜}.`,
        /* 74 */ `Master your breathing while typing under extreme time pressure [🧘‍♂️].`,
        /* 75 */ `The arena transforms into a glowing matrix {🟢} of high speed data streams.`,
        /* 76 */ `Defend your territory against wave after wave {🌊} of robotic invaders.`,
        /* 77 */ `Speed is your shield and accuracy is your sword {⚔️} in this digital duel.`,
        /* 78 */ `The final stretch of your journey {🏁} requires flawless execution now.`,
        /* 79 */ `Prepare yourself for the ultimate confrontation {⚔️} against the master boss.`,
        /* 80 */ `[BOSS LEVEL 80]: Omega Tufan Dragon awakens with devastating fire power {🐉🔥}.`,

        /* 81 */ `Tufani Mode Engaged [⚡ 1000V]: Maximum speed and precision required!`,
        /* 82 */ `Only the bravest warriors conquer these treacherous high tier levels {🏔️}.`,
        /* 83 */ `Your reflex speed reaches supersonic levels {✈️} through intense training.`,
        /* 84 */ `The dragon roars across the digital skies {🐉} shaking the entire arena.`,
        /* 85 */ `Maintain perfect focus {🎯} even when the timer drops below ten seconds.`,
        /* 86 */ `Every keystroke resonates with pure electrical energy {⚡} in the mainframe.`,
        /* 87 */ `Survive the onslaught of elite enemies {🛡️} using flawless typing mechanics.`,
        /* 88 */ `The summit of typing mastery is almost within your reach {🏔️🏅}.`,
        /* 89 */ `Break all previous WPM records {🚀} to etch your name in the Hall of Fame.`,
        /* 90 */ `[BOSS LEVEL 90]: Ancient Dragon unleashes supernova plasma blasts {💥}.`,

        /* 91 */ `The final ten trials represent the ultimate test of human typing capability {👑}.`,
        /* 92 */ `Sanctuary protocols activated [🛡️] to protect your remaining health pool.`,
        /* 93 */ `Lightning fast reflexes and calm nerves {⚡🧘} define a true champion.`,
        /* 94 */ `The digital universe bows before your unstoppable typing velocity {🌌}.`,
        /* 95 */ `Stand tall against the final boss {🦖} and strike with legendary precision.`,
        /* 96 */ `Only five steps remain between you and absolute typing immortality {🌟}.`,
        /* 97 */ `The legendary golden keyboard is granted only to masters of level ninety-seven {⌨️}.`,
        /* 98 */ `Almost at the finish line {🏁}—keep your speed high and errors to absolute zero.`,
        /* 99 */ `The penultimate battle tests every ounce of your accumulated skill {🔥}.`,
        /* 100*/ `[FINAL BOSS LEVEL 100]: Defeat the Omega Tufan Dragon and claim eternal glory {🏆🐉}!`
    ];

    return templates[(lvl - 1) % templates.length];
}

function buildAll100Levels() {
    const levels = [];

    for (let lvl = 1; lvl <= 100; lvl++) {
        const isBoss = lvl % 10 === 0;
        const text = getUniqueSentence(lvl);
        
        let targetWpm = 15 + Math.floor((lvl - 1) * 0.6);
        if (targetWpm > 75) targetWpm = 75;

        const damagePerMistake = isBoss ? 18 : 12;

        const wordEquivalent = text.length / 5;
        const idealSeconds = (wordEquivalent / (targetWpm * 0.7)) * 60;
        const timeLimit = Math.max(22, Math.round(idealSeconds + 14));

        const enemyData = isBoss
            ? ENEMY_ROSTER[9]
            : ENEMY_ROSTER[(lvl - 1) % (ENEMY_ROSTER.length - 1)];

        levels.push({
            level: lvl,
            isBoss,
            enemyName: isBoss ? `BOSS: ${enemyData.name} LVL-${lvl}` : enemyData.name,
            enemyEmoji: enemyData.emoji,
            text,
            targetWpm,
            timeLimit,
            damagePerMistake,
            enemyMaxHp: text.length * 10
        });
    }

    return levels;
}

const LEVELS = buildAll100Levels();

// ==================== 4. SAVE SYSTEM & PROFILE (localStorage) ====================
const SAVE_KEY = "tufani_typing_profile_v1";

let saveData = {
    playerName: "",
    playerAvatar: "🥷",
    unlockedLevel: 1,
    stars: {},
    bestWpm: {}
};

function loadProgress() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            saveData.playerName = parsed.playerName || "";
            saveData.playerAvatar = parsed.playerAvatar || "🥷";
            saveData.unlockedLevel = parsed.unlockedLevel || 1;
            saveData.stars = parsed.stars || {};
            saveData.bestWpm = parsed.bestWpm || {};
        }
    } catch (e) {
        console.warn("Could not load save data:", e);
    }
}

function saveProgress() {
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    } catch (e) {
        console.warn("Could not save data:", e);
    }
}

function getTotalStars() {
    return Object.values(saveData.stars).reduce((sum, s) => sum + s, 0);
}

// ==================== 5. GAME STATE & DOM ELEMENTS ====================
let currentLevelObj = null;
let charIndex = 0;
let mistakes = 0;
let totalTyped = 0;
let combo = 0;
let heroHp = 100;
let enemyHp = 100;
let timeLeft = 60;
let timerInterval = null;
let startTime = null;
let isPlaying = false;

const screens = {
    menu: document.getElementById("menu-screen"),
    level: document.getElementById("level-screen"),
    game: document.getElementById("game-screen")
};

const el = {
    setupModal: document.getElementById("setup-modal"),
    playerNameInput: document.getElementById("player-name-input"),
    avatarGrid: document.getElementById("avatar-grid"),
    btnSaveProfile: document.getElementById("btn-save-profile"),
    displayPlayerName: document.getElementById("display-player-name"),
    displayPlayerAvatar: document.getElementById("display-player-avatar"),
    profileBadgeBtn: document.getElementById("profile-badge-btn"),

    menuUnlocked: document.getElementById("menu-unlocked-lvl"),
    menuStars: document.getElementById("menu-total-stars"),
    mapStars: document.getElementById("map-stars-display"),
    levelGrid: document.getElementById("level-grid"),

    hudLevelText: document.getElementById("hud-level-text"),
    hudBossTag: document.getElementById("hud-boss-tag"),
    hudTimer: document.getElementById("hud-timer"),
    hudWpm: document.getElementById("hud-wpm"),
    hudTargetWpm: document.getElementById("hud-target-wpm"),
    hudAccuracy: document.getElementById("hud-accuracy"),

    battleArena: document.getElementById("battle-arena"),
    heroDisplayName: document.getElementById("hero-display-name"),
    heroHpText: document.getElementById("hero-hp-text"),
    heroHpFill: document.getElementById("hero-hp-fill"),
    heroSprite: document.getElementById("hero-sprite"),
    heroAvatarIcon: document.getElementById("hero-avatar-icon"),
    heroDmgPopup: document.getElementById("hero-dmg-popup"),

    enemyName: document.getElementById("enemy-name"),
    enemyHpText: document.getElementById("enemy-hp-text"),
    enemyHpFill: document.getElementById("enemy-hp-fill"),
    enemySprite: document.getElementById("enemy-sprite"),
    enemyEmoji: document.getElementById("enemy-emoji"),
    enemyDmgPopup: document.getElementById("enemy-dmg-popup"),

    comboBadge: document.getElementById("combo-badge"),
    battleMsg: document.getElementById("battle-status-msg"),
    projectile: document.getElementById("projectile"),
    damageOverlay: document.getElementById("damage-overlay"),

    textDisplay: document.getElementById("text-display"),
    progressPercent: document.getElementById("progress-percent"),
    typingProgressFill: document.getElementById("typing-progress-fill"),

    winModal: document.getElementById("win-modal"),
    loseModal: document.getElementById("lose-modal")
};

// ==================== 6. INITIALIZATION & SETUP MODAL ====================
function initGame() {
    loadProgress();
    renderAvatarPicker();

    if (!saveData.playerName || saveData.playerName.trim() === "") {
        el.setupModal.classList.remove("hidden");
    } else {
        el.setupModal.classList.add("hidden");
        updateMenuProfileUI();
    }
    updateMenuStats();
}

function renderAvatarPicker() {
    el.avatarGrid.innerHTML = "";
    HERO_AVATARS.forEach(av => {
        const div = document.createElement("div");
        div.className = `avatar-option ${av === selectedAvatar ? "selected" : ""}`;
        div.textContent = av;
        div.addEventListener("click", () => {
            selectedAvatar = av;
            document.querySelectorAll(".avatar-option").forEach(o => o.classList.remove("selected"));
            div.classList.add("selected");
        });
        el.avatarGrid.appendChild(div);
    });
}

function updateMenuProfileUI() {
    el.displayPlayerName.textContent = saveData.playerName || "Warrior";
    el.displayPlayerAvatar.textContent = saveData.playerAvatar || "🥷";
}

el.btnSaveProfile.addEventListener("click", () => {
    const nameVal = el.playerNameInput.value.trim();
    if (!nameVal) {
        alert("Please enter your warrior name!");
        return;
    }
    saveData.playerName = nameVal;
    saveData.playerAvatar = selectedAvatar;
    saveProgress();

    el.setupModal.classList.add("hidden");
    updateMenuProfileUI();
    updateMenuStats();
});

el.profileBadgeBtn.addEventListener("click", () => {
    el.playerNameInput.value = saveData.playerName;
    selectedAvatar = saveData.playerAvatar;
    renderAvatarPicker();
    el.setupModal.classList.remove("hidden");
});

// ==================== 7. NAVIGATION & UI UPDATES ====================
function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove("active"));
    screens[name].classList.add("active");
    el.winModal.classList.add("hidden");
    el.loseModal.classList.add("hidden");

    if (name === "menu") updateMenuStats();
    if (name === "level") renderLevelGrid();
}

function updateMenuStats() {
    el.menuUnlocked.textContent = `${saveData.unlockedLevel} / 100`;
    el.menuStars.textContent = `⭐ ${getTotalStars()} / 300`;
}

function renderLevelGrid() {
    el.mapStars.textContent = `⭐ ${getTotalStars()} / 300`;
    el.levelGrid.innerHTML = "";

    LEVELS.forEach(lvlObj => {
        const card = document.createElement("div");
        const isLocked = lvlObj.level > saveData.unlockedLevel;
        const earnedStars = saveData.stars[lvlObj.level] || 0;
        const bestWpm = saveData.bestWpm[lvlObj.level] || 0;

        card.className = `level-card ${lvlObj.isBoss ? "boss" : ""} ${isLocked ? "locked" : ""}`;

        let starsHtml = "";
        for (let s = 1; s <= 3; s++) {
            starsHtml += s <= earnedStars ? "⭐" : "☆";
        }

        card.innerHTML = `
            <div class="lvl-num">${isLocked ? "🔒" : ""} ${lvlObj.level}</div>
            <div class="lvl-stars">${starsHtml}</div>
            <div class="lvl-wpm">${bestWpm > 0 ? `Best: ${bestWpm} WPM` : `Goal: ${lvlObj.targetWpm} WPM`}</div>
        `;

        if (!isLocked) {
            card.addEventListener("click", () => startLevel(lvlObj.level));
        }

        el.levelGrid.appendChild(card);
    });
}

// ==================== 8. CORE GAMEPLAY & COMBAT LOGIC ====================
function startLevel(levelNumber) {
    clearInterval(timerInterval);
    currentLevelObj = LEVELS[levelNumber - 1];

    charIndex = 0;
    mistakes = 0;
    totalTyped = 0;
    combo = 0;
    heroHp = 100;
    enemyHp = currentLevelObj.enemyMaxHp;
    timeLeft = currentLevelObj.timeLimit;
    startTime = null;
    isPlaying = true;

    showScreen("game");
    stopConfetti();

    el.hudLevelText.textContent = `LEVEL ${currentLevelObj.level}`;
    el.hudBossTag.classList.toggle("hidden", !currentLevelObj.isBoss);
    el.hudTimer.textContent = `${timeLeft}s`;
    el.hudWpm.textContent = "0";
    el.hudTargetWpm.textContent = `Target: ${currentLevelObj.targetWpm}`;
    el.hudAccuracy.textContent = "100%";

    // Set Hero & Enemy details
    el.heroDisplayName.textContent = saveData.playerName.toUpperCase();
    el.heroAvatarIcon.textContent = saveData.playerAvatar;

    el.enemyName.textContent = `${currentLevelObj.enemyEmoji} ${currentLevelObj.enemyName}`;
    el.enemyEmoji.textContent = currentLevelObj.enemyEmoji;
    updateHealthBars();

    el.comboBadge.textContent = "COMBO x0";
    el.battleMsg.textContent = "Type the sentence to launch your attack!";
    el.progressPercent.textContent = "0% Completed";
    el.typingProgressFill.style.width = "0%";

    el.textDisplay.innerHTML = "";
    currentLevelObj.text.split("").forEach((ch, idx) => {
        const span = document.createElement("span");
        span.className = idx === 0 ? "char current" : "char";
        span.textContent = ch;
        el.textDisplay.appendChild(span);
    });
}

function startTimerIfNeeded() {
    if (startTime !== null) return;
    startTime = Date.now();

    timerInterval = setInterval(() => {
        if (!isPlaying) return;
        timeLeft--;
        el.hudTimer.textContent = `${ Math.max(0, timeLeft) }s`;
        updateLiveMetrics();

        if (timeLeft <= 0) {
            triggerDefeat("⏱️ Time's Up! The Enemy Overcame You!");
        }
    }, 1000);
}

function updateLiveMetrics() {
    const wpm = calculateWPM();
    const acc = calculateAccuracy();
    el.hudWpm.textContent = wpm;
    el.hudAccuracy.textContent = `${acc}%`;
}

function calculateWPM() {
    if (!startTime) return 0;
    const elapsedMinutes = Math.max((Date.now() - startTime) / 60000, 0.01);
    const words = charIndex / 5;
    return Math.round(words / elapsedMinutes);
}

function calculateAccuracy() {
    if (totalTyped === 0) return 100;
    const correct = totalTyped - mistakes;
    return Math.max(0, Math.round((correct / totalTyped) * 100));
}

function updateHealthBars() {
    const heroPercent = Math.max(0, heroHp);
    el.heroHpFill.style.width = `${heroPercent}%`;
    el.heroHpText.textContent = `${heroPercent} / 100 HP`;

    const enemyPercent = Math.max(0, (enemyHp / currentLevelObj.enemyMaxHp) * 100);
    el.enemyHpFill.style.width = `${enemyPercent}%`;
    el.enemyHpText.textContent = `${Math.max(0, enemyHp)} / ${currentLevelObj.enemyMaxHp} HP`;
}

function triggerHeroAttack() {
    sfx.hit();

    el.heroSprite.classList.remove("hero-attack");
    void el.heroSprite.offsetWidth;
    el.heroSprite.classList.add("hero-attack");

    el.enemySprite.classList.remove("hit-shake");
    void el.enemySprite.offsetWidth;
    el.enemySprite.classList.add("hit-shake");

    el.projectile.textContent = combo >= 10 ? "⚡" : "⚔️";
    el.projectile.className = "projectile fire-right";
    setTimeout(() => { el.projectile.className = "projectile"; }, 220);

    showDamagePopup(el.enemyDmgPopup, "-10", "#ffd700");
}

function triggerEnemyCounterAttack() {
    sfx.hurt();

    el.damageOverlay.classList.add("flash");
    setTimeout(() => el.damageOverlay.classList.remove("flash"), 180);

    el.battleArena.classList.remove("screen-shake");
    void el.battleArena.offsetWidth;
    el.battleArena.classList.add("screen-shake");

    el.enemySprite.classList.remove("enemy-attack");
    void el.enemySprite.offsetWidth;
    el.enemySprite.classList.add("enemy-attack");

    el.heroSprite.classList.remove("hit-shake");
    void el.heroSprite.offsetWidth;
    el.heroSprite.classList.add("hit-shake");

    el.projectile.textContent = "💥";
    el.projectile.className = "projectile fire-left";
    setTimeout(() => { el.projectile.className = "projectile"; }, 240);

    showDamagePopup(el.heroDmgPopup, `-${currentLevelObj.damagePerMistake} HP`, "#dc2626");
}

function showDamagePopup(element, text, color) {
    element.textContent = text;
    element.style.color = color;
    element.classList.remove("show");
    void element.offsetWidth;
    element.classList.add("show");
}

// ==================== 9. KEYBOARD INPUT HANDLER ====================
window.addEventListener("keydown", (e) => {
    if (!isPlaying) return;

    if (["Shift", "Control", "Alt", "Meta", "CapsLock", "Tab", "Escape"].includes(e.key)) {
        return;
    }

    if (e.key === " ") {
        e.preventDefault();
    }

    if (e.key.length !== 1) return;

    startTimerIfNeeded();

    const charSpans = el.textDisplay.querySelectorAll(".char");
    const expectedChar = currentLevelObj.text[charIndex];

    totalTyped++;

    if (e.key === expectedChar) {
        charSpans[charIndex].classList.remove("current", "incorrect");
        charSpans[charIndex].classList.add("correct");

        charIndex++;
        combo++;
        enemyHp = Math.max(0, enemyHp - 10);

        el.comboBadge.textContent = `COMBO x${combo}`;
        el.battleMsg.textContent = combo >= 15 ? "🔥 LIGHTNING STRIKE!" : "⚔️ Direct Hit!";

        triggerHeroAttack();
        updateHealthBars();
        updateLiveMetrics();

        const pct = Math.round((charIndex / currentLevelObj.text.length) * 100);
        el.progressPercent.textContent = `${pct}% Completed`;
        el.typingProgressFill.style.width = `${pct}%`;

        if (charIndex < currentLevelObj.text.length) {
            charSpans[charIndex].classList.add("current");
            charSpans[charIndex].scrollIntoView({ block: "nearest", behavior: "smooth" });
        } else {
            triggerVictory();
        }
    } else {
        mistakes++;
        combo = 0;
        heroHp = Math.max(0, heroHp - currentLevelObj.damagePerMistake);

        charSpans[charIndex].classList.add("incorrect");
        el.comboBadge.textContent = "COMBO BROKEN!";
        el.battleMsg.textContent = `💥 Mistake! ${currentLevelObj.enemyName} hit you for -${currentLevelObj.damagePerMistake} HP!`;

        triggerEnemyCounterAttack();
        updateHealthBars();
        updateLiveMetrics();

        if (heroHp <= 0) {
            triggerDefeat("💀 Your Health Dropped to Zero!");
        }
    }
});

// ==================== 10. WIN & LOSE EFFECTS ====================
function triggerVictory() {
    isPlaying = false;
    clearInterval(timerInterval);
    sfx.win();
    startConfetti();

    const finalWpm = calculateWPM();
    const finalAcc = calculateAccuracy();

    const earnedStar1 = true;
    const earnedStar2 = finalAcc >= 95;
    const earnedStar3 = finalWpm >= currentLevelObj.targetWpm;

    let starsCount = 1;
    if (earnedStar2) starsCount++;
    if (earnedStar3) starsCount++;

    const lvl = currentLevelObj.level;
    saveData.stars[lvl] = Math.max(saveData.stars[lvl] || 0, starsCount);
    saveData.bestWpm[lvl] = Math.max(saveData.bestWpm[lvl] || 0, finalWpm);

    if (lvl >= saveData.unlockedLevel && lvl < 100) {
        saveData.unlockedLevel = lvl + 1;
    }
    saveProgress();

    document.getElementById("win-level-title").textContent = `LEVEL ${lvl} CLEARED!`;
    document.getElementById("star-3-desc").textContent = `Speed ≥ ${currentLevelObj.targetWpm} WPM`;
    document.getElementById("win-wpm").textContent = `${finalWpm} WPM`;
    document.getElementById("win-acc").textContent = `${finalAcc}%`;
    document.getElementById("win-time").textContent = `${timeLeft}s`;
    document.getElementById("win-hp").textContent = `${heroHp}%`;

    const star1El = document.getElementById("star-1");
    const star2El = document.getElementById("star-2");
    const star3El = document.getElementById("star-3");

    [star1El, star2El, star3El].forEach(s => s.classList.remove("earned"));
    el.winModal.classList.remove("hidden");

    if (earnedStar1) {
        setTimeout(() => { star1El.classList.add("earned"); sfx.starPop(1); }, 300);
    }
    if (earnedStar2) {
        setTimeout(() => { star2El.classList.add("earned"); sfx.starPop(2); }, 650);
    }
    if (earnedStar3) {
        setTimeout(() => { star3El.classList.add("earned"); sfx.starPop(3); }, 1000);
    }

    document.getElementById("btn-win-next").style.display = lvl < 100 ? "inline-block" : "none";
}

function triggerDefeat(reasonText) {
    isPlaying = false;
    clearInterval(timerInterval);
    sfx.lose();

    const finalWpm = calculateWPM();
    const finalAcc = calculateAccuracy();
    const pct = Math.round((charIndex / currentLevelObj.text.length) * 100);

    document.getElementById("lose-reason").textContent = reasonText;
    document.getElementById("lose-wpm").textContent = `${finalWpm} WPM`;
    document.getElementById("lose-acc").textContent = `${finalAcc}%`;
    document.getElementById("lose-prog").textContent = `${pct}%`;

    el.loseModal.classList.remove("hidden");
}

// ==================== 11. CONFETTI ENGINE ====================
const canvas = document.getElementById("fx-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
let confettiAnimId = null;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function startConfetti() {
    particles = [];
    const colors = ["#ffd700", "#00ff88", "#ffaa00", "#dc2626", "#a855f7"];

    for (let i = 0; i < 110; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: 8 + Math.random() * 6,
            h: 8 + Math.random() * 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            vy: 2.5 + Math.random() * 4,
            vx: (Math.random() - 0.5) * 3,
            angle: Math.random() * 360,
            spin: (Math.random() - 0.5) * 8
        });
    }
    animateConfetti();
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.y += p.vy;
        p.x += p.vx;
        p.angle += p.spin;
        if (p.y > canvas.height) p.y = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
    });
    confettiAnimId = requestAnimationFrame(animateConfetti);
}

function stopConfetti() {
    if (confettiAnimId) cancelAnimationFrame(confettiAnimId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ==================== 12. EVENT LISTENERS ====================
document.getElementById("btn-continue").addEventListener("click", () => {
    startLevel(saveData.unlockedLevel);
});

document.getElementById("btn-levels").addEventListener("click", () => {
    showScreen("level");
});

document.getElementById("btn-sound").addEventListener("click", (e) => {
    sfx.enabled = !sfx.enabled;
    e.target.textContent = sfx.enabled ? "🔊 SOUND: ON" : "🔇 SOUND: OFF";
});

document.getElementById("btn-back-menu").addEventListener("click", () => {
    showScreen("menu");
});

document.getElementById("btn-reset-save").addEventListener("click", () => {
    if (confirm("Are you sure you want to reset all progress and profile?")) {
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    }
});

document.getElementById("btn-quit-level").addEventListener("click", () => {
    isPlaying = false;
    clearInterval(timerInterval);
    showScreen("level");
});

document.getElementById("btn-win-replay").addEventListener("click", () => {
    startLevel(currentLevelObj.level);
});

document.getElementById("btn-win-map").addEventListener("click", () => {
    stopConfetti();
    showScreen("level");
});

document.getElementById("btn-win-next").addEventListener("click", () => {
    if (currentLevelObj.level < 100) {
        startLevel(currentLevelObj.level + 1);
    }
});

document.getElementById("btn-lose-retry").addEventListener("click", () => {
    startLevel(currentLevelObj.level);
});

document.getElementById("btn-lose-map").addEventListener("click", () => {
    showScreen("level");
});

// Run Init on Load
initGame();