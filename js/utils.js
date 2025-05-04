// utils.js - Utility functions for Peel & Eat Golf Scorecards

/**
 * Utility functions
 */

/**
 * Shows an alert message to the user
 * @param {string} message - The message to display
 * @param {string} type - The type of alert: 'success', 'error', 'warning'
 * @param {number} duration - How long to show the message in ms
 */
function showAlert(message, type = 'success', duration = 3000) {
    const alertBox = document.getElementById('alert-message');
    const alertContent = document.getElementById('alert-content');
    const alertIcon = document.getElementById('alert-icon');
    
    if (!alertBox || !alertContent) return;
    
    // Set content and styling
    alertContent.textContent = message;
    alertBox.classList.remove('hidden');
    
    // Set icon based on type
    let iconSvg = '';
    switch (type) {
        case 'success':
            iconSvg = '<svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
            break;
        case 'error':
            iconSvg = '<svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
            break;
        case 'warning':
            iconSvg = '<svg class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';
            break;
    }
    
    if (alertIcon) alertIcon.innerHTML = iconSvg;
    
    // Auto-hide after duration
    setTimeout(() => {
        alertBox.classList.add('hidden');
    }, duration);
    
    // Add close button handler
    document.getElementById('alert-close')?.addEventListener('click', () => {
        alertBox.classList.add('hidden');
    });
}

/**
 * Shows the loading overlay
 * @param {boolean} show - Whether to show or hide the overlay
 */
function showLoading(show = true) {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.toggle('hidden', !show);
    }
}

/**
 * Debounces a function call
 * @param {Function} func - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, delay = 300) {
    return function(...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

/**
 * Formats currency value
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
function formatCurrency(amount) {
    // Handle edge cases
    if (amount === null || amount === undefined || isNaN(amount)) return '$0.00';
    
    // Format the number with 2 decimal places
    return '$' + Math.abs(parseFloat(amount)).toFixed(2);
}

/**
 * Gets CSS class based on match status (relative to P1/T1)
 * @param {number|string} status - The status value
 * @returns {string} - CSS class name
 */
function getStatusClass(status) {
    if (status === 0 || status === 'AS' || status === 'ALL SQUARE') return 'status-halve';
    if (status > 0 || String(status).includes('UP')) return 'status-win';
    return 'status-loss';
}

/**
 * Gets CSS class based on numeric value (positive/negative)
 * @param {number} value - The numeric value
 * @returns {string} - CSS class name
 */
function getValueClass(value) {
    if (value === 0) return '';
    return value > 0 ? 'value-positive' : 'value-negative';
}

/**
 * Formats match play status string
 * @param {number} status - The status value (positive if P1 is up)
 * @param {number} holesRemaining - Number of holes remaining
 * @param {boolean} isFinal - Whether this is the final status
 * @param {string} p1Name - Player 1's name
 * @param {string} p2Name - Player 2's name
 * @returns {string} - Formatted status string
 */
function formatMatchStatus(status, holesRemaining, isFinal = false, p1Name = 'P1', p2Name = 'P2') {
    if (status === 0) {
        return holesRemaining > 0 ? 'AS' : 'TIED';
    }
    
    const abs = Math.abs(status);
    const leader = status > 0 ? p1Name : p2Name;
    
    if (abs > holesRemaining) {
        return `${leader} ${abs - holesRemaining} & ${abs > holesRemaining + 1 ? holesRemaining + 1 : holesRemaining}`;
    }
    
    // Standard display
    return `${leader} ${abs}${isFinal ? '' : ' UP'}`;
}

/**
 * Checks if browser supports localStorage
 * @returns {boolean} - Whether localStorage is available
 */
function isStorageAvailable() {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Validates a score input relative to par
 * @param {number} score - The entered score
 * @param {number} par - The par for the hole
 * @returns {Object} - Validation result {valid: boolean, message: string}
 */
function validateScore(score, par) {
    if (score === null || score === undefined || score === '') {
        return { valid: true, message: '' }; // Empty is allowed
    }
    
    // Convert to number
    const numScore = parseInt(score);
    const numPar = parseInt(par);
    
    // Basic validation
    if (isNaN(numScore) || numScore < 1) {
        return { valid: false, message: 'Score must be a positive number' };
    }
    
    // Par-related validation
    if (!isNaN(numPar) && numPar > 0) {
        if (numScore > numPar + 5) {
            return { valid: true, warning: true, message: 'Score seems high relative to par' };
        }
        if (numScore < numPar - 3 && numPar > 3) {
            return { valid: true, warning: true, message: 'Score seems low relative to par' };
        }
    }
    
    return { valid: true, message: '' };
}

/**
 * Calculate Stableford points for a given score relative to par
 * @param {number} score - The player's score
 * @param {number} par - The par for the hole
 * @param {string} system - 'standard' or 'modified' Stableford system
 * @returns {number} - The Stableford points earned
 */
function calculateStablefordPoints(score, par, system = 'standard') {
    if (score === null || score === undefined || par === null || par === undefined) {
        return null;
    }
    
    const scoreDiff = score - par; // Positive is over par, negative is under par
    
    if (system === 'standard') {
        // Standard: Bogey = 1, Par = 2, Birdie = 3, Eagle = 4, etc.
        switch (scoreDiff) {
            case 0: return 2;  // Par
            case 1: return 1;  // Bogey
            case -1: return 3; // Birdie
            case -2: return 4; // Eagle
            case -3: return 5; // Double Eagle / Albatross
            default:
                return scoreDiff >= 2 ? 0 : 5 - scoreDiff; // 0 for double bogey or worse
        }
    } else if (system === 'modified') {
        // Modified: Net Double = -1, Bogey = 0, Par = 1, Birdie = 2, etc.
        switch (scoreDiff) {
            case 0: return 1;  // Par
            case 1: return 0;  // Bogey
            case 2: return -1; // Double Bogey
            case -1: return 2; // Birdie
            case -2: return 3; // Eagle
            case -3: return 4; // Double Eagle / Albatross
            default:
                return scoreDiff >= 3 ? -2 : 4 - scoreDiff; // -2 for triple bogey or worse
        }
    }
    
    // Default case - return null for unknown systems
    return null;
}

/**
 * State Management Functions
 */

/**
 * Saves currentRoundState to localStorage
 */
function saveState() {
    if (!isStorageAvailable()) {
        console.warn("LocalStorage not available. State cannot be saved.");
        showAlert("Your progress cannot be saved automatically. Please export your data manually.", "warning");
        return false;
    }
    
    try {
        // Add metadata to the state
        const stateToSave = {
            ...currentRoundState,
            _metadata: {
                version: APP_VERSION,
                timestamp: new Date().toISOString(),
            }
        };
        
        localStorage.setItem(CURRENT_ROUND_STORAGE_KEY, JSON.stringify(stateToSave));
        console.log("Round state saved");
        
        // Update resume button visibility
        const resumeButton = document.getElementById('resume-round-btn');
        if (resumeButton) {
            resumeButton.classList.toggle('hidden', !localStorage.getItem(CURRENT_ROUND_STORAGE_KEY));
        }
        return true;
    } catch (e) {
        console.error("Error saving state to localStorage:", e);
        showAlert("Could not save round progress. Local storage might be full or disabled.", "error");
        return false;
    }
}

/**
 * Loads round state from localStorage
 * @returns {Object|null} - The loaded state or null
 */
function loadState() {
    if (!isStorageAvailable()) {
        console.warn("LocalStorage not available. State cannot be loaded.");
        return null;
    }
    
    try {
        const savedState = localStorage.getItem(CURRENT_ROUND_STORAGE_KEY);
        if (savedState) {
            console.log("Round state loaded");
            return JSON.parse(savedState);
        }
        return null;
    } catch (e) {
        console.error("Error loading state from localStorage:", e);
        localStorage.removeItem(CURRENT_ROUND_STORAGE_KEY);
        showAlert("There was an error loading your previous round.", "error");
        return null;
    }
}

/**
 * Exports the current state to a JSON file
 */
function exportState() {
    if (!currentRoundState || !currentRoundState.gameType) {
        showAlert("No active round to export.", "warning");
        return;
    }
    
    try {
        // Add metadata to the state
        const stateToExport = {
            ...currentRoundState,
            _metadata: {
                version: APP_VERSION,
                timestamp: new Date().toISOString(),
                exported: true
            }
        };
        
        const dataStr = JSON.stringify(stateToExport, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const fileName = `peel-eat-${currentRoundState.gameType}-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', fileName);
        linkElement.style.display = 'none';
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);
        
        showAlert("Round data exported successfully!", "success");
    } catch (e) {
        console.error("Error exporting state:", e);
        showAlert("Failed to export round data.", "error");
    }
}

/**
 * Imports state from a JSON file
 * @param {File} file - The file to import
 */
function importState(file) {
    if (!file) {
        showAlert("No file selected.", "warning");
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(event) {
        try {
            const importedState = JSON.parse(event.target.result);
            
            // Basic validation
            if (!importedState || !importedState.gameType) {
                throw new Error("Invalid data format");
            }
            
            // Check if the game type is supported
            if (!document.getElementById(`${importedState.gameType}-card`)) {
                throw new Error("Game type not supported in this version");
            }
            
            // Confirm before overwriting current state
            if (currentRoundState.gameType && !confirm(`This will overwrite your current ${currentRoundState.gameType} round. Continue?`)) {
                return;
            }
            
            // Set the state and update UI
            currentRoundState = importedState;
            saveState();
            showScorecard(importedState.gameType);
            showAlert("Round data imported successfully!", "success");
        } catch (e) {
            console.error("Error importing state:", e);
            showAlert("Failed to import round data. Invalid file format.", "error");
        }
    };
    
    reader.onerror = function() {
        showAlert("Error reading file.", "error");
    };
    
    reader.readAsText(file);
}

/**
 * UI Management Functions
 */

/**
 * Shows the specified scorecard and hides others
 * @param {string} gameType - Type of game to show
 */
function showScorecard(gameType) {
    // Show loading indicator for large state changes
    showLoading(true);
    
    setTimeout(() => {
        const gameSelectionSection = document.getElementById('game-selection');
        const activeScorecardSection = document.getElementById('active-scorecard');
        
        gameSelectionSection.classList.add('hidden');
        activeScorecardSection.classList.remove('hidden');
    
        // Hide all scorecards
        const scorecardContainers = document.querySelectorAll('.scorecard');
        let cardFound = false;
        
        scorecardContainers.forEach(container => {
            const isTarget = container.id === `${gameType}-card`;
            container.classList.toggle('hidden', !isTarget);
            if (isTarget) cardFound = true;
        });
    
        if (!cardFound) {
            console.error(`Scorecard container not found for game type: ${gameType}`);
            showGameSelection();
            showAlert(`Could not find scorecard for ${gameType}`, "error");
            return;
        }
    
        // Update selected button
        const gameSelectButtons = document.querySelectorAll('.game-select-btn');
        gameSelectButtons.forEach(btn => {
             btn.classList.toggle('selected', btn.dataset.game === gameType);
        });
    
        initializeActiveCard(gameType);
        showLoading(false);
    }, 100); // Short timeout to allow UI to render loading indicator
}

/**
 * Shows the game selection screen
 */
function showGameSelection() {
    const activeScorecardSection = document.getElementById('active-scorecard');
    const gameSelectionSection = document.getElementById('game-selection');
    
    activeScorecardSection.classList.add('hidden');
    gameSelectionSection.classList.remove('hidden');
    
    // Deselect all game buttons
    const gameSelectButtons = document.querySelectorAll('.game-select-btn');
    gameSelectButtons.forEach(btn => btn.classList.remove('selected'));
}

/**
 * Clears current round state and resets UI
 */
function clearCurrentRound() {
    if (confirm("Are you sure you want to clear all data for the current round? This cannot be undone.")) {
        const previousGameType = currentRoundState.gameType; // Get type before clearing
        currentRoundState = {};
        localStorage.removeItem(CURRENT_ROUND_STORAGE_KEY);
        showGameSelection();

        // Reset all inputs
        const scorecardContainers = document.querySelectorAll('.scorecard');
        scorecardContainers.forEach(container => {
            container.querySelectorAll('input, select').forEach(input => {
                 if (input.type === 'checkbox' || input.type === 'radio') input.checked = false;
                 else input.value = '';
            });
        });

        // Call specific reset functions based on the previous game type
        switch (previousGameType) {
             case 'nassau': resetNassauDisplay(); break;
             case 'skins': resetSkinsDisplay(); break;
             case 'wolf': resetWolfDisplay(); break;
             case 'bingo': resetBingoDisplay(); break;
             case 'bloodsome': resetBloodsomeDisplay(); break;
             case 'stableford': resetStablefordDisplay(); break;
             case 'banker': resetBankerDisplay(); break;
             case 'vegas': resetVegasDisplay(); break;
        }

        console.log("Current round cleared.");
        const resumeButton = document.getElementById('resume-round-btn');
        if (resumeButton) {
            resumeButton.classList.add('hidden');
        }
        showAlert("Round data cleared successfully", "success");
    }
}

/**
 * Sets up the default data structure for a game type in currentRoundState
 * @param {string} gameType - The type of game to initialize
 */
function initializeDefaultState(gameType) {
    currentRoundState = { gameType: gameType }; // Base state
    const defaultPar = Array(18).fill(4); // Common default

    switch (gameType) {
        case 'nassau':
            currentRoundState.players = ['', ''];
            currentRoundState.wager = 5;
            currentRoundState.pressRule = 'manual';
            currentRoundState.par = [...defaultPar];
            currentRoundState.scores = { p1: Array(18).fill(null), p2: Array(18).fill(null) };
            currentRoundState.presses = [];
            currentRoundState.results = { holeResults: [], matchStatus: [], pressResults: [] };
            currentRoundState.settlement = {};
            break;
        case 'skins':
             currentRoundState.players = ['', '', '', ''];
             currentRoundState.wager = 1;
             currentRoundState.validation = false;
             currentRoundState.carryover = true;
             currentRoundState.par = [...defaultPar];
             currentRoundState.scores = { p1: Array(18).fill(null), p2: Array(18).fill(null), p3: Array(18).fill(null), p4: Array(18).fill(null) };
             currentRoundState.results = { winners: Array(18).fill(null), values: Array(18).fill(0), carryovers: Array(18).fill(0) };
             currentRoundState.settlement = { skinsWon: [0, 0, 0, 0], winnings: [0, 0, 0, 0], totalPot: 0, summaryText: '' };
            break;
        case 'wolf':
             currentRoundState.players = ['', '', '', ''];
             currentRoundState.pointValue = 1;
             currentRoundState.loneMultiplier = 3;
             currentRoundState.scores = { p1: Array(18).fill(null), p2: Array(18).fill(null), p3: Array(18).fill(null), p4: Array(18).fill(null) };
             currentRoundState.selections = Array(18).fill('');
             currentRoundState.results = { points: Array(18).fill(null).map(() => [0, 0, 0, 0]) };
             currentRoundState.settlement = { totalPoints: [0, 0, 0, 0], winnings: [0, 0, 0, 0], summaryText: '' };
            break;
        case 'bingo':
             currentRoundState.players = ['', '', '', ''];
             currentRoundState.pointValue = 0.5;
             currentRoundState.marks = {
                 p1: { bi: Array(18).fill(false), ba: Array(18).fill(false), bo: Array(18).fill(false) },
                 p2: { bi: Array(18).fill(false), ba: Array(18).fill(false), bo: Array(18).fill(false) },
                 p3: { bi: Array(18).fill(false), ba: Array(18).fill(false), bo: Array(18).fill(false) },
                 p4: { bi: Array(18).fill(false), ba: Array(18).fill(false), bo: Array(18).fill(false) }
             };
             currentRoundState.results = { pointsPerHole: Array(18).fill(null).map(() => [0, 0, 0, 0]) };
             currentRoundState.settlement = { totalPoints: [0, 0, 0, 0], winnings: [0, 0, 0, 0], summaryText: '' };
            break;
        case 'bloodsome':
             currentRoundState.teams = { t1: { pA: '', pB: '' }, t2: { pC: '', pD: '' } };
             currentRoundState.wager = 10;
             currentRoundState.drives = { t1: Array(18).fill(''), t2: Array(18).fill('') };
             currentRoundState.scores = { t1: Array(18).fill(null), t2: Array(18).fill(null) };
             currentRoundState.results = { holeResults: Array(18).fill(0), matchStatus: Array(18).fill(0) };
             currentRoundState.settlement = { finalStatusText: '--', summaryText: '' };
            break;
        case 'stableford':
             currentRoundState.players = ['', '', '', ''];
             currentRoundState.pointSystem = 'standard';
             currentRoundState.pointValue = 1;
             currentRoundState.par = [...defaultPar];
             currentRoundState.scores = { p1: Array(18).fill(null), p2: Array(18).fill(null), p3: Array(18).fill(null), p4: Array(18).fill(null) };
             currentRoundState.results = { points: { p1: Array(18).fill(0), p2: Array(18).fill(0), p3: Array(18).fill(0), p4: Array(18).fill(0) } };
             currentRoundState.settlement = { totalPoints: [0, 0, 0, 0], winnings: [0, 0, 0, 0], summaryText: '' };
            break;
        case 'banker':
             currentRoundState.players = ['', '', '', ''];
             currentRoundState.quotas = [36, 36, 36, 36];
             currentRoundState.pointValue = 1;
             currentRoundState.pointSystem = 'stableford-standard';
             currentRoundState.par = [...defaultPar];
             currentRoundState.scores = { p1: Array(18).fill(null), p2: Array(18).fill(null), p3: Array(18).fill(null), p4: Array(18).fill(null) };
             currentRoundState.points = { p1: Array(18).fill(null), p2: Array(18).fill(null), p3: Array(18).fill(null), p4: Array(18).fill(null) };
             currentRoundState.results = {};
             currentRoundState.settlement = { totalPoints: [0, 0, 0, 0], vsQuota: [0, 0, 0, 0], winnings: [0, 0, 0, 0], summaryText: '' };
            break;
        case 'vegas':
             currentRoundState.teams = { t1: { pA: '', pB: '' }, t2: { pC: '', pD: '' } };
             currentRoundState.pointValue = 1;
             currentRoundState.scores = { 
                 pA: Array(18).fill(null), pB: Array(18).fill(null),
                 pC: Array(18).fill(null), pD: Array(18).fill(null)
             };
             currentRoundState.results = { 
                 t1Num: Array(18).fill(null),
                 t2Num: Array(18).fill(null),
                 diff: Array(18).fill(0)
             };
             currentRoundState.settlement = { totalDiff: 0, summaryText: '' };
            break;
    }
    
    console.log("Initialized default state for:", gameType);
    return currentRoundState;
}
