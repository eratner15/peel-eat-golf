
/**
 * Game Implementation: STABLEFORD
 * 
 * Stableford is a scoring system where:
 * - Points are awarded on each hole relative to par
 * - Standard system: 0 points for double bogey or worse, 1 for bogey, 2 for par, 3 for birdie, 4 for eagle
 * - Modified system: -1 for double bogey, 0 for bogey, 1 for par, 2 for birdie, 3 for eagle
 * - The player with the most points at the end of the round wins
 */

/**
 * Generate Stableford scorecard rows
 */
function generateStablefordRows() {
    const tbody = document.getElementById('stableford-scorecard-body');
    if (!tbody || tbody.children.length > 0) return; // Already populated
    
    let html = '';
    
    for (let i = 1; i <= 18; i++) {
        html += `
            <tr id="stableford-row-h${i}">
                <td class="td-std font-medium">${i}</td>
                <td class="td-std"><input type="number" id="stableford-h${i}-par" min="3" max="6" class="input-std input-par" aria-label="Hole ${i} Par"></td>
                <td class="td-std"><input type="number" id="stableford-p1-h${i}-score" min="1" class="input-std input-score" aria-label="Player 1 Score Hole ${i}"></td>
                <td class="td-std"><input type="number" id="stableford-p2-h${i}-score" min="1" class="input-std input-score" aria-label="Player 2 Score Hole ${i}"></td>
                <td class="td-std"><input type="number" id="stableford-p3-h${i}-score" min="1" class="input-std input-score" aria-label="Player 3 Score Hole ${i}"></td>
                <td class="td-std"><input type="number" id="stableford-p4-h${i}-score" min="1" class="input-std input-score" aria-label="Player 4 Score Hole ${i}"></td>
                <td class="td-std p1-cell" id="stableford-h${i}-p1-pts"></td>
                <td class="td-std p2-cell" id="stableford-h${i}-p2-pts"></td>
                <td class="td-std p3-cell" id="stableford-h${i}-p3-pts"></td>
                <td class="td-std p4-cell" id="stableford-h${i}-p4-pts"></td>
            </tr>`;
        
        // Add summary rows
        if (i === 9) {
            html += `
                <tr class="bg-gray-100 font-semibold">
                    <td class="td-std">OUT</td>
                    <td class="td-std" id="stableford-out-par"></td>
                    <td class="td-std" id="stableford-p1-out-score"></td>
                    <td class="td-std" id="stableford-p2-out-score"></td>
                    <td class="td-std" id="stableford-p3-out-score"></td>
                    <td class="td-std" id="stableford-p4-out-score"></td>
                    <td class="td-std p1-cell" id="stableford-p1-out-pts"></td>
                    <td class="td-std p2-cell" id="stableford-p2-out-pts"></td>
                    <td class="td-std p3-cell" id="stableford-p3-out-pts"></td>
                    <td class="td-std p4-cell" id="stableford-p4-out-pts"></td>
                </tr>`;
        } else if (i === 18) {
            html += `
                <tr class="bg-gray-100 font-semibold">
                    <td class="td-std">IN</td>
                    <td class="td-std" id="stableford-in-par"></td>
                    <td class="td-std" id="stableford-p1-in-score"></td>
                    <td class="td-std" id="stableford-p2-in-score"></td>
                    <td class="td-std" id="stableford-p3-in-score"></td>
                    <td class="td-std" id="stableford-p4-in-score"></td>
                    <td class="td-std p1-cell" id="stableford-p1-in-pts"></td>
                    <td class="td-std p2-cell" id="stableford-p2-in-pts"></td>
                    <td class="td-std p3-cell" id="stableford-p3-in-pts"></td>
                    <td class="td-std p4-cell" id="stableford-p4-in-pts"></td>
                </tr>
                <tr class="bg-gray-200 font-bold">
                    <td class="td-std">TOTAL</td>
                    <td class="td-std" id="stableford-total-par"></td>
                    <td class="td-std" id="stableford-p1-total-score"></td>
                    <td class="td-std" id="stableford-p2-total-score"></td>
                    <td class="td-std" id="stableford-p3-total-score"></td>
                    <td class="td-std" id="stableford-p4-total-score"></td>
                    <td class="td-std p1-cell" id="stableford-p1-total-pts"></td>
                    <td class="td-std p2-cell" id="stableford-p2-total-pts"></td>
                    <td class="td-std p3-cell" id="stableford-p3-total-pts"></td>
                    <td class="td-std p4-cell" id="stableford-p4-total-pts"></td>
                </tr>`;
        }
    }
    
    if (tbody) tbody.innerHTML = html;
}

/**
 * Initialize Stableford: Add listeners for player name changes and point system selection
 */
function initializeStableford() {
    console.log("Initializing Stableford");
    
    // Update header names when players change
    const playerInputs = [];
    const playerHeaders = [];
    
    for (let i = 1; i <= 4; i++) {
        playerInputs.push(document.getElementById(`stableford-p${i}-name`));
        playerHeaders.push(document.getElementById(`stableford-th-p${i}`));
        playerHeaders.push(document.getElementById(`stableford-th-p${i}-pts`));
    }
    
    const updateHeaders = () => {
        for (let i = 0; i < 4; i++) {
            const playerName = playerInputs[i]?.value || `P${i+1}`;
            
            // Update both score and points column headers
            if (playerHeaders[i*2]) {
                playerHeaders[i*2].textContent = playerName;
            }
            
            if (playerHeaders[i*2+1]) {
                playerHeaders[i*2+1].textContent = `${playerName} Pts`;
            }
        }
        
        // Update settlement display names
        updateStablefordSettlement();
    };
    
    playerInputs.forEach(input => {
        if (input) input.addEventListener('input', updateHeaders);
    });
    
    // Add listeners for point system and value changes
    document.getElementById('stableford-point-system')?.addEventListener('change', updateStableford);
    document.getElementById('stableford-point-value')?.addEventListener('input', updateStableford);
    
    // Generate rows if needed
    generateStablefordRows();
}

/**
 * Reset Stableford Display: Clear calculated values in the UI
 */
function resetStablefordDisplay() {
    console.log("Reset Stableford Display");
    
    // Reset point cells
    for (let i = 1; i <= 18; i++) {
        for (let p = 1; p <= 4; p++) {
            document.getElementById(`stableford-h${i}-p${p}-pts`)?.textContent = '';
        }
    }
    
    // Reset summary fields
    document.getElementById('stableford-out-par')?.textContent = '';
    document.getElementById('stableford-in-par')?.textContent = '';
    document.getElementById('stableford-total-par')?.textContent = '';
    
    for (let p = 1; p <= 4; p++) {
        document.getElementById(`stableford-p${p}-out-score`)?.textContent = '';
        document.getElementById(`stableford-p${p}-in-score`)?.textContent = '';
        document.getElementById(`stableford-p${p}-total-score`)?.textContent = '';
        document.getElementById(`stableford-p${p}-out-pts`)?.textContent = '';
        document.getElementById(`stableford-p${p}-in-pts`)?.textContent = '';
        document.getElementById(`stableford-p${p}-total-pts`)?.textContent = '';
    }
    
    // Reset headers
    for (let p = 1; p <= 4; p++) {
        document.getElementById(`stableford-th-p${p}`)?.textContent = `P${p}`;
        document.getElementById(`stableford-th-p${p}-pts`)?.textContent = `P${p} Pts`;
    }
    
    // Reset settlement area
    for (let p = 1; p <= 4; p++) {
        document.getElementById(`stableford-settle-p${p}-name`)?.textContent = `Player ${p}:`;
        document.getElementById(`stableford-settle-p${p}-points`)?.textContent = '0';
        document.getElementById(`stableford-settle-p${p}-winnings`)?.textContent = '0.00';
    }
    document.getElementById('stableford-settlement-summary-text')?.textContent = '';
}

/**
 * Populate Stableford inputs from state
 */
function populateStableford() {
    console.log("Populate Stableford");
    if (!currentRoundState || currentRoundState.gameType !== 'stableford') return;
    
    // Player names
    for (let i = 0; i < 4; i++) {
        document.getElementById(`stableford-p${i+1}-name`).value = currentRoundState.players[i] || '';
        
        // Update headers with player names
        const playerName = currentRoundState.players[i] || `P${i+1}`;
        document.getElementById(`stableford-th-p${i+1}`).textContent = playerName;
        document.getElementById(`stableford-th-p${i+1}-pts`).textContent = `${playerName} Pts`;
    }
    
    // Options
    document.getElementById('stableford-point-system').value = currentRoundState.pointSystem || 'standard';
    document.getElementById('stableford-point-value').value = currentRoundState.pointValue ?? 1;
    
    // Par and scores
    for (let i = 0; i < 18; i++) {
        const hole = i + 1;
        const parInput = document.getElementById(`stableford-h${hole}-par`);
        if (parInput) parInput.value = currentRoundState.par[i] || '';
        
        for (let p = 1; p <= 4; p++) {
            const scoreInput = document.getElementById(`stableford-p${p}-h${hole}-score`);
            if (scoreInput) {
                const score = currentRoundState.scores[`p${p}`][i];
                scoreInput.value = score !== null ? score : '';
            }
        }
    }
    
    // Results will be populated by updateStableford
}

/**
 * Update Stableford: Calculate points for each player and update settlement
 */
function updateStableford() {
    console.log("Update Stableford");
    if (!currentRoundState || currentRoundState.gameType !== 'stableford') return;
    
    // --- 1. Read inputs into state ---
    currentRoundState.players = [];
    for (let i = 1; i <= 4; i++) {
        currentRoundState.players.push(document.getElementById(`stableford-p${i}-name`)?.value || '');
    }
    
    currentRoundState.pointSystem = document.getElementById('stableford-point-system')?.value || 'standard';
    currentRoundState.pointValue = parseFloat(document.getElementById('stableford-point-value')?.value) || 1;
    
    // Read par and scores
    const par = [];
    const scores = { p1: [], p2: [], p3: [], p4: [] };
    
    for (let i = 1; i <= 18; i++) {
        const parVal = document.getElementById(`stableford-h${i}-par`)?.value;
        par.push(parVal === '' ? null : parseInt(parVal));
        
        for (let p = 1; p <= 4; p++) {
            const scoreVal = document.getElementById(`stableford-p${p}-h${i}-score`)?.value;
            scores[`p${p}`].push(scoreVal === '' ? null : parseInt(scoreVal));
        }
    }
    
    currentRoundState.par = par;
    currentRoundState.scores = scores;
    
    // --- 2. Calculate Stableford points ---
    // For each player and hole, calculate points based on the selected system
    const points = {
        p1: [],
        p2: [],
        p3: [],
        p4: []
    };
    
    for (let i = 0; i < 18; i++) {
        const holePar = par[i];
        
        for (let p = 1; p <= 4; p++) {
            const score = scores[`p${p}`][i];
            let holePoints = null;
            
            // Calculate points if we have both par and score
            if (holePar !== null && score !== null) {
                holePoints = calculateStablefordPoints(score, holePar, currentRoundState.pointSystem);
            }
            
            points[`p${p}`].push(holePoints);
        }
    }
    
    // Store results in state
    currentRoundState.results = { points: points };
    
    // --- 3. Update UI ---
    // Update hole-by-hole points
    for (let i = 0; i < 18; i++) {
        const hole = i + 1;
        
        for (let p = 1; p <= 4; p++) {
            const pointsCell = document.getElementById(`stableford-h${hole}-p${p}-pts`);
            const pointsValue = points[`p${p}`][i];
            
            if (pointsCell) {
                if (pointsValue !== null) {
                    pointsCell.textContent = pointsValue;
                    pointsCell.className = `td-std ${pointsValue > 0 ? 'high-points' : ''}`;
                } else {
                    pointsCell.textContent = '';
                    pointsCell.className = 'td-std';
                }
            }
        }
    }
    
    // Calculate and display summary statistics
    let frontPar = 0, backPar = 0, totalPar = 0;
    const frontScores = [0, 0, 0, 0];
    const backScores = [0, 0, 0, 0];
    const totalScores = [0, 0, 0, 0];
    const frontPoints = [0, 0, 0, 0];
    const backPoints = [0, 0, 0, 0];
    const totalPoints = [0, 0, 0, 0];
    const frontValid = [true, true, true, true];
    const backValid = [true, true, true, true];
    
    for (let i = 0; i < 18; i++) {
        const holeNum = i + 1;
        const curPar = par[i];
        
        if (curPar !== null) {
            if (holeNum <= 9) frontPar += curPar;
            else backPar += curPar;
            totalPar += curPar;
        }
        
        for (let p = 0; p < 4; p++) {
            const pKey = `p${p+1}`;
            const score = scores[pKey][i];
            const pointsValue = points[pKey][i];
            
            if (score !== null) {
                if (holeNum <= 9) frontScores[p] += score;
                else backScores[p] += score;
                totalScores[p] += score;
            } else {
                if (holeNum <= 9) frontValid[p] = false;
                else backValid[p] = false;
            }
            
            if (pointsValue !== null) {
                if (holeNum <= 9) frontPoints[p] += pointsValue;
                else backPoints[p] += pointsValue;
                totalPoints[p] += pointsValue;
            }
        }
    }
    
    // Update summary row cells
    document.getElementById('stableford-out-par').textContent = frontPar || '';
    document.getElementById('stableford-in-par').textContent = backPar || '';
    document.getElementById('stableford-total-par').textContent = totalPar || '';
    
    for (let p = 0; p < 4; p++) {
        document.getElementById(`stableford-p${p+1}-out-score`).textContent = frontValid[p] ? frontScores[p] : '';
        document.getElementById(`stableford-p${p+1}-in-score`).textContent = backValid[p] ? backScores[p] : '';
        document.getElementById(`stableford-p${p+1}-total-score`).textContent = (frontValid[p] || backValid[p]) ? totalScores[p] : '';
        
        // Points summary
        document.getElementById(`stableford-p${p+1}-out-pts`).textContent = frontPoints[p] || '';
        document.getElementById(`stableford-p${p+1}-in-pts`).textContent = backPoints[p] || '';
        document.getElementById(`stableford-p${p+1}-total-pts`).textContent = totalPoints[p] || '';
    }
    
    // Update settlement
    updateStablefordSettlement(totalPoints);
}

/**
 * Update Stableford settlement information
 * @param {Array} totalPoints - Array of total points for each player
 */
function updateStablefordSettlement(totalPoints = null) {
    if (!currentRoundState || currentRoundState.gameType !== 'stableford') return;
    
    // Use provided points or get from state
    const points = totalPoints || [0, 0, 0, 0].map((_, i) => {
        const playerPoints = currentRoundState.results?.points?.[`p${i+1}`] || [];
        return playerPoints.reduce((sum, p) => sum + (p || 0), 0);
    });
    
    // Calculate winnings based on point value
    const pointValue = currentRoundState.pointValue || 1;
    
    // Calculate settlement - net vs. average
    const totalPointsSum = points.reduce((sum, p) => sum + p, 0);
    const avgPoints = totalPointsSum / 4;
    
    const winnings = points.map(p => (p - avgPoints) * pointValue);
    
    // Create settlement summary
    const settlement = {
        totalPoints: points,
        winnings: winnings,
        summaryText: ''
    };
    
    // Generate summary text
    const summaryLines = [];
    for (let p = 0; p < 4; p++) {
        if (winnings[p] !== 0) {
            const playerName = currentRoundState.players[p] || `Player ${p+1}`;
            if (winnings[p] > 0) {
                summaryLines.push(`${playerName} collects ${formatCurrency(winnings[p])}`);
            } else {
                summaryLines.push(`${playerName} pays ${formatCurrency(Math.abs(winnings[p]))}`);
            }
        }
    }
    
    if (summaryLines.length > 0) {
        settlement.summaryText = summaryLines.join(', ');
    } else {
        settlement.summaryText = 'No points awarded yet';
    }
    
    currentRoundState.settlement = settlement;
    
    // Update UI
    for (let p = 0; p < 4; p++) {
        document.getElementById(`stableford-settle-p${p+1}-name`).textContent = `${currentRoundState.players[p] || `Player ${p+1}`}:`;
        document.getElementById(`stableford-settle-p${p+1}-points`).textContent = points[p] || '0';
        document.getElementById(`stableford-settle-p${p+1}-winnings`).textContent = formatCurrency(winnings[p] || 0).replace(', '');
    }
    
    document.getElementById('stableford-settlement-summary-text').textContent = settlement.summaryText;
}
