/**
 * Reset Wolf Display: Clear calculated values in the UI
 */
function resetWolfDisplay() {
    console.log("Reset Wolf Display");
    
    // Reset wolf player names
    for (let i = 1; i <= 18; i++) {
        const wolfPlayerIndex = ((i - 1) % 4) + 1;
        document.getElementById(`wolf-h${i}-wolf-player`).textContent = `P${wolfPlayerIndex}`;
        document.getElementById(`wolf-h${i}-selection`).value = '';
        
        // Reset point cells
        for (let p = 1; p <= 4; p++) {
            document.getElementById(`wolf-h${i}-p${p}-pts`)?.textContent = '';
        }
    }
    
    // Reset summary fields
    for (let p = 1; p <= 4; p++) {
        document.getElementById(`wolf-p${p}-out-score`)?.textContent = '';
        document.getElementById(`wolf-p${p}-in-score`)?.textContent = '';
        document.getElementById(`wolf-p${p}-total-score`)?.textContent = '';
        document.getElementById(`wolf-p${p}-out-pts`)?.textContent = '';
        document.getElementById(`wolf-p${p}-in-pts`)?.textContent = '';
        document.getElementById(`wolf-p${p}-total-pts`)?.textContent = '';
    }
    
    // Reset headers
    for (let p = 1; p <= 4; p++) {
        document.getElementById(`wolf-th-p${p}`)?.textContent = `P${p}`;
    }
    
    // Reset settlement area
    for (let p = 1; p <= 4; p++) {
        document.getElementById(`wolf-settle-p${p}-name`)?.textContent = `Player ${p}:`;
        document.getElementById(`wolf-settle-p${p}-points`)?.textContent = '0';
        document.getElementById(`wolf-settle-p${p}-winnings`)?.textContent = '0.00';
    }
    document.getElementById('wolf-settlement-summary-text')?.textContent = '';
}

/**
 * Populate Wolf inputs from state
 */
function populateWolf() {
    console.log("Populate Wolf");
    if (!currentRoundState || currentRoundState.gameType !== 'wolf') return;
    
    // Player names
    for (let i = 0; i < 4; i++) {
        document.getElementById(`wolf-p${i+1}-name`).value = currentRoundState.players[i] || '';
        document.getElementById(`wolf-th-p${i+1}`).textContent = currentRoundState.players[i] || `P${i+1}`;
    }
    
    // Options
    document.getElementById('wolf-point-value').value = currentRoundState.pointValue ?? 1;
    document.getElementById('wolf-lone-multiplier').value = currentRoundState.loneMultiplier ?? 3;
    
    // Update wolf player names and selections
    for (let i = 0; i < 18; i++) {
        const hole = i + 1;
        const wolfPlayerIndex = ((i) % 4);
        const wolfCell = document.getElementById(`wolf-h${hole}-wolf-player`);
        
        if (wolfCell) {
            const wolfName = currentRoundState.players[wolfPlayerIndex] || `P${wolfPlayerIndex+1}`;
            wolfCell.textContent = wolfName;
        }
        
        // Set selection
        const selectionInput = document.getElementById(`wolf-h${hole}-selection`);
        if (selectionInput) {
            selectionInput.value = currentRoundState.selections[i] || '';
        }
        
        // Scores
        for (let p = 1; p <= 4; p++) {
            const scoreInput = document.getElementById(`wolf-p${p}-h${hole}-score`);
            if (scoreInput) {
                const score = currentRoundState.scores[`p${p}`][i];
                scoreInput.value = score !== null ? score : '';
            }
        }
    }
    
    // Results will be populated by updateWolf
}

/**
 * Update Wolf: Calculate points for each player on each hole and update settlement
 */
function updateWolf() {
    console.log("Update Wolf");
    if (!currentRoundState || currentRoundState.gameType !== 'wolf') return;
    
    // --- 1. Read inputs into state ---
    currentRoundState.players = [];
    for (let i = 1; i <= 4; i++) {
        currentRoundState.players.push(document.getElementById(`wolf-p${i}-name`)?.value || '');
    }
    
    currentRoundState.pointValue = parseFloat(document.getElementById('wolf-point-value')?.value) || 1;
    currentRoundState.loneMultiplier = parseFloat(document.getElementById('wolf-lone-multiplier')?.value) || 3;
    
    // Read selection and scores
    const selections = [];
    const scores = { p1: [], p2: [], p3: [], p4: [] };
    
    for (let i = 1; i <= 18; i++) {
        // Selection
        const selectionVal = document.getElementById(`wolf-h${i}-selection`)?.value;
        selections.push(selectionVal || '');
        
        // Scores
        for (let p = 1; p <= 4; p++) {
            const scoreVal = document.getElementById(`wolf-p${p}-h${i}-score`)?.value;
            scores[`p${p}`].push(scoreVal === '' ? null : parseInt(scoreVal));
        }
    }
    
    currentRoundState.selections = selections;
    currentRoundState.scores = scores;
    
    // --- 2. Calculate points for each hole ---
    const points = Array(18).fill(null).map(() => [0, 0, 0, 0]);
    
    for (let i = 0; i < 18; i++) {
        const wolfPlayerIndex = (i % 4); // 0-based index
        const selection = selections[i];
        
        // Skip holes without selection or scores
        if (!selection) continue;
        
        const holeScores = [
            scores.p1[i],
            scores.p2[i],
            scores.p3[i],
            scores.p4[i]
        ];
        
        // Skip holes with incomplete scores
        if (holeScores.some(s => s === null)) continue;
        
        // Find lowest score
        const lowestScore = Math.min(...holeScores);
        
        // Handle 'alone' selection (wolf plays alone)
        if (selection === 'alone') {
            const wolfScore = holeScores[wolfPlayerIndex];
            
            // Wolf wins if they have the lowest score (tied or outright)
            if (wolfScore === lowestScore) {
                // Wolf wins points from all other players
                const multiplier = currentRoundState.loneMultiplier || 3;
                points[i][wolfPlayerIndex] = multiplier; // Lone wolf gets 3x points by default
                
                // Other players lose 1 point each
                for (let p = 0; p < 4; p++) {
                    if (p !== wolfPlayerIndex) {
                        points[i][p] = -1;
                    }
                }
            }
            // Wolf loses if they don't have the lowest score
            else {
                // Wolf loses to all other players
                points[i][wolfPlayerIndex] = -3; // Lose to 3 players
                
                // Other players win 1 point each
                for (let p = 0; p < 4; p++) {
                    if (p !== wolfPlayerIndex) {
                        points[i][p] = 1;
                    }
                }
            }
        }
        // Handle partner selection
        else if (selection.startsWith('p')) {
            const partnerIndex = parseInt(selection.substring(1)) - 1; // 0-based index
            
            // Skip invalid partners (the wolf themselves)
            if (partnerIndex === wolfPlayerIndex) continue;
            
            const wolfTeamScores = [holeScores[wolfPlayerIndex], holeScores[partnerIndex]];
            const wolfTeamLowest = Math.min(...wolfTeamScores);
            
            // Determine opponents
            const opponents = [0, 1, 2, 3].filter(p => p !== wolfPlayerIndex && p !== partnerIndex);
            
            if (wolfTeamLowest === lowestScore) {
                // Wolf team wins
                points[i][wolfPlayerIndex] = 2; // Wolf gets 2 points
                points[i][partnerIndex] = 1;   // Partner gets 1 point
                
                // Opponents lose 1 point each
                opponents.forEach(p => {
                    points[i][p] = -1;
                });
            } else {
                // Wolf team loses
                points[i][wolfPlayerIndex] = -2; // Wolf loses 2 points
                points[i][partnerIndex] = -1;   // Partner loses 1 point
                
                // Opponents win 1 point each
                opponents.forEach(p => {
                    points[i][p] = 1;
                });
            }
        }
    }
    
    // Store results in state
    currentRoundState.results = { points: points };
    
    // --- 3. Update UI ---
    // Update hole-by-hole points
    for (let i = 0; i < 18; i++) {
        const hole = i + 1;
        
        for (let p = 0; p < 4; p++) {
            const pointsCell = document.getElementById(`wolf-h${hole}-p${p+1}-pts`);
            const pointValue = points[i][p];
            
            if (pointsCell) {
                if (pointValue !== 0) {
                    pointsCell.textContent = pointValue > 0 ? `+${pointValue}` : pointValue;
                    pointsCell.className = `td-std ${getValueClass(pointValue)}`;
                } else {
                    pointsCell.textContent = '';
                    pointsCell.className = 'td-std';
                }
            }
        }
    }
    
    // Calculate and display summary statistics
    const outScores = [0, 0, 0, 0];
    const inScores = [0, 0, 0, 0];
    const totalScores = [0, 0, 0, 0];
    const outPoints = [0, 0, 0, 0];
    const inPoints = [0, 0, 0, 0];
    const totalPoints = [0, 0, 0, 0];
    const frontValid = [true, true, true, true];
    const backValid = [true, true, true, true];
    
    for (let i = 0; i < 18; i++) {
        const holeNum = i + 1;
        
        for (let p = 0; p < 4; p++) {
            const score = scores[`p${p+1}`][i];
            
            if (score !== null) {
                if (holeNum <= 9) outScores[p] += score;
                else inScores[p] += score;
                totalScores[p] += score;
            } else {
                if (holeNum <= 9) frontValid[p] = false;
                else backValid[p] = false;
            }
            
            // Add points
            const pointValue = points[i][p];
            if (holeNum <= 9) outPoints[p] += pointValue;
            else inPoints[p] += pointValue;
            totalPoints[p] += pointValue;
        }
    }
    
    // Update summary row cells
    for (let p = 0; p < 4; p++) {
        document.getElementById(`wolf-p${p+1}-out-score`).textContent = frontValid[p] ? outScores[p] : '';
        document.getElementById(`wolf-p${p+1}-in-score`).textContent = backValid[p] ? inScores[p] : '';
        document.getElementById(`wolf-p${p+1}-total-score`).textContent = (frontValid[p] || backValid[p]) ? totalScores[p] : '';
        
        // Points summary
        document.getElementById(`wolf-p${p+1}-out-pts`).textContent = outPoints[p] !== 0 ? outPoints[p] : '';
        document.getElementById(`wolf-p${p+1}-in-pts`).textContent = inPoints[p] !== 0 ? inPoints[p] : '';
        document.getElementById(`wolf-p${p+1}-total-pts`).textContent = totalPoints[p] !== 0 ? totalPoints[p] : '';
    }
    
    // Update settlement
    updateWolfSettlement(totalPoints);
}

/**
 * Update Wolf settlement information
 * @param {Array} totalPoints - Array of total points for each player
 */
function updateWolfSettlement(totalPoints = null) {
    if (!currentRoundState || currentRoundState.gameType !== 'wolf') return;
    
    // Use provided points or calculate from results
    const points = totalPoints || [0, 0, 0, 0].map((_, i) => {
        return currentRoundState.results?.points.reduce((sum, holePoints) => sum + (holePoints[i] || 0), 0) || 0;
    });
    
    // Calculate winnings based on point value
    const pointValue = currentRoundState.pointValue || 1;
    const winnings = points.map(p => p * pointValue);
    
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
        document.getElementById(`wolf-settle-p${p+1}-name`).textContent = `${currentRoundState.players[p] || `Player ${p+1}`}:`;
        document.getElementById(`wolf-settle-p${p+1}-points`).textContent = points[p];
        document.getElementById(`wolf-settle-p${p+1}-winnings`).textContent = formatCurrency(winnings[p]).replace('$', '');
    }
    
    document.getElementById('wolf-settlement-summary-text').textContent = settlement.summaryText;
}
