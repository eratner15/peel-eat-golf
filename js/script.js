// script.js - Main script for Peel & Eat Golf Scorecards

/**
 * Constants and state management
 */
const CURRENT_ROUND_STORAGE_KEY = 'peelEatGolfRoundData'; // Key for localStorage
const APP_VERSION = '1.0.0'; // For data versioning
let currentRoundState = {}; // Global object for active round data
let debounceTimer; // For debouncing input events

/**
 * DOM Element references - cached to improve performance
 */
const DOM = {
    gameSelectionSection: document.getElementById('game-selection'),
    activeScorecardSection: document.getElementById('active-scorecard'),
    gameSelectButtons: document.querySelectorAll('.game-select-btn'),
    scorecardContainers: document.querySelectorAll('.scorecard'),
    resumeRoundButton: document.getElementById('resume-round-btn'),
    backToSelectionButton: document.getElementById('back-to-selection-btn'),
    clearRoundButton: document.getElementById('clear-round-btn'),
    copySummaryButton: document.getElementById('copy-summary-btn'),
    exportDataButton: document.getElementById('export-data-btn'),
    importDataButton: document.getElementById('import-data-btn'),
    importFileInput: document.getElementById('import-file-input'),
    loadingOverlay: document.getElementById('loading-overlay'),
    currentYearSpan: document.getElementById('current-year')
};

/**
 * Initialization function - runs when DOM is loaded
 */
function initApp() {
    // Set current year in footer
    DOM.currentYearSpan.textContent = new Date().getFullYear();
    
    // Add event listeners
    addEventListeners();
    
    // Check for existing round data
    const savedState = loadState();
    if (savedState && savedState.gameType) {
        currentRoundState = savedState;
        DOM.resumeRoundButton.classList.remove('hidden');
    }
    
    // Debounce input events for performance
    setupAutoSave();
}

/**
 * Add event listeners to DOM elements
 */
function addEventListeners() {
    // Game selection buttons
    DOM.gameSelectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const gameType = this.dataset.game;
            startNewGame(gameType);
        });
    });
    
    // Resume round button
    DOM.resumeRoundButton.addEventListener('click', function() {
        if (currentRoundState && currentRoundState.gameType) {
            showScorecard(currentRoundState.gameType);
        }
    });
    
    // Back to selection button
    DOM.backToSelectionButton.addEventListener('click', function() {
        showGameSelection();
    });
    
    // Clear round button
    DOM.clearRoundButton.addEventListener('click', function() {
        clearCurrentRound();
    });
    
    // Copy summary button
    DOM.copySummaryButton.addEventListener('click', function() {
        copySummaryToClipboard();
    });
    
    // Export data button
    DOM.exportDataButton.addEventListener('click', function() {
        exportState();
    });
    
    // Import data button
    DOM.importDataButton.addEventListener('click', function() {
        DOM.importFileInput.click();
    });
    
    // Import file input
    DOM.importFileInput.addEventListener('change', function(event) {
        if (event.target.files.length > 0) {
            importState(event.target.files[0]);
        }
    });
}

/**
 * Sets up auto-save functionality for inputs
 */
function setupAutoSave() {
    document.addEventListener('input', debounce(function(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT') {
            saveState();
        }
    }, 500));
}

/**
 * Starts a new game of the specified type
 * @param {string} gameType - Type of game to start
 */
function startNewGame(gameType) {
    // Check if there's an active round and confirm before overwriting
    if (currentRoundState.gameType && currentRoundState.gameType !== gameType) {
        if (!confirm(`This will start a new ${gameType} round and discard your current ${currentRoundState.gameType} round. Continue?`)) {
            return;
        }
    }
    
    initializeDefaultState(gameType);
    saveState();
    showScorecard(gameType);
}

/**
 * Initializes the active scorecard based on game type
 * @param {string} gameType - Type of game to initialize
 */
function initializeActiveCard(gameType) {
    // Reset all inputs if not resuming a saved game
    if (!currentRoundState || !currentRoundState.gameType) {
        const container = document.getElementById(`${gameType}-card`);
        if (container) {
            container.querySelectorAll('input, select').forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = false;
                } else {
                    input.value = '';
                }
            });
        }
    }
    
    // Generate scorecard rows 
    switch (gameType) {
        case 'nassau':
            generateNassauRows();
            initializeNassau();
            populateNassau();
            break;
        case 'skins':
            generateSkinsRows();
            initializeSkins();
            populateSkins();
            break;
        case 'wolf':
            generateWolfRows();
            initializeWolf();
            populateWolf();
            break;
        case 'bingo':
            generateBingoRows();
            initializeBingo();
            populateBingo();
            break;
        case 'bloodsome':
            generateBloodsomeRows();
            initializeBloodsome();
            populateBloodsome();
            break;
        case 'stableford':
            generateStablefordRows();
            initializeStableford();
            populateStableford();
            break;
        case 'banker':
            generateBankerRows();
            initializeBanker();
            populateBanker();
            break;
        case 'vegas':
            generateVegasRows();
            initializeVegas();
            populateVegas();
            break;
    }
    
    // Add input event listeners to all inputs in the active card
    const inputs = document.getElementById(`${gameType}-card`).querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            // Call the specific update function based on game type
            switch (gameType) {
                case 'nassau': updateNassau(); break;
                case 'skins': updateSkins(); break;
                case 'wolf': updateWolf(); break;
                case 'bingo': updateBingo(); break;
                case 'bloodsome': updateBloodsome(); break;
                case 'stableford': updateStableford(); break;
                case 'banker': updateBanker(); break;
                case 'vegas': updateVegas(); break;
            }
            
            // Save state after update
            saveState();
        });
    });
}

/**
 * Copies the settlement summary to clipboard
 */
function copySummaryToClipboard() {
    if (!currentRoundState || !currentRoundState.gameType) {
        showAlert("No active round to copy.", "warning");
        return;
    }
    
    let summaryElement;
    switch (currentRoundState.gameType) {
        case 'nassau':
            summaryElement = document.getElementById('nassau-settlement-summary-text');
            break;
        case 'skins':
            summaryElement = document.getElementById('skins-total-pot').parentElement.parentElement;
            break;
        case 'wolf':
            summaryElement = document.getElementById('wolf-settlement-summary-text');
            break;
        case 'bingo':
            summaryElement = document.getElementById('bingo-settlement-summary-text');
            break;
        case 'bloodsome':
            summaryElement = document.getElementById('bloodsome-settlement-summary-text');
            break;
        case 'stableford':
            summaryElement = document.getElementById('stableford-settlement-summary-text');
            break;
        case 'banker':
            summaryElement = document.getElementById('banker-settlement-summary-text');
            break;
        case 'vegas':
            summaryElement = document.getElementById('vegas-settlement-summary-text');
            break;
        default:
            summaryElement = null;
    }
    
    if (!summaryElement) {
        showAlert("No summary available to copy.", "warning");
        return;
    }
    
    // Generate a formatted summary
    const gameTitle = currentRoundState.gameType.charAt(0).toUpperCase() + currentRoundState.gameType.slice(1);
    const summaryText = summaryElement.textContent.trim();
    const fullText = `${gameTitle} Game Results: ${summaryText}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(fullText).then(() => {
        showAlert("Summary copied to clipboard!", "success");
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        showAlert("Failed to copy to clipboard.", "error");
    });
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
