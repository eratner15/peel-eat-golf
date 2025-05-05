
/**
 * Game Implementation: BINGO BANGO BONGO
 * 
 * Bingo Bango Bongo is a game where players earn points for three achievements on each hole:
 * - Bingo: First player to get their ball on the green
 * - Bango: Player whose ball is closest to the pin once all balls are on the green
 * - Bongo: First player to hole out (get the ball in the cup)
 * 
 * Each achievement is worth one point, for a total of 3 points available per hole.
 */

/**
 * Generate Bingo Bango Bongo scorecard rows
 */
function generateBingoRows() {
    const tbody = document.getElementById('bingo-scorecard-body');
    if (!tbody || tbody.children.length > 0) return; // Already populated
    
    let html = '';
    
    for (let i = 1; i <= 18; i++) {
        html += `
            <tr id="bingo-row-h${i}">
                <td class="td-std font-medium">${i}</td>
                <td class="td-std">
                    <div class="text-center">
                        <input type="checkbox" id="bingo-p1-h${i}-bi" class="bingo-checkbox" aria-label="Player 1 Bingo Hole ${i}">
                    </div>
                </td>
                <td class="td-std">
                    <div class="text-center">
                        <input type="checkbox" id="bingo-p1-h${i}-ba" class="bingo-checkbox" aria-label="Player 1 Bango Hole ${i}">
                    </div>
                </td>
                <td class="td-std">
                    <div class="text-center">
                        <input type="checkbox" id="bingo-p1-h${i}-bo" class="bingo-checkbox" aria-label="Player 1 Bongo Hole ${i}">
                    </div>
                </td>
                <td class="td-std">
                    <div class="text-center">
                        <input type="checkbox" id="bingo-p2-h${i}-bi" class="bingo-checkbox" aria-label="Player 2 Bingo Hole ${i}">
                    </div>
                </td>
                <td class="td-std">
                    <div class="text-center">
                        <input type="checkbox" id="bingo-p2-h${i}-ba" class="bingo-checkbox" aria-label="Player 2 Bango Hole ${i}">
                    </div>
                </td>
                <td class="td-std">
                    <div class="text-center">
                        <input type="checkbox" id="bingo-p2-h${i}-bo" class="bingo-checkbox" aria-label="Player 2 Bongo Hole ${i}">
                    </div>
                </td>
                <td class="td-std">
                    <div class="text-center">
                        <input type="checkbox" id="bingo-p3-h${i}-bi" class="bingo-checkbox" aria-label="Player 3 Bingo Hole ${i}">
                    </div>
                </td>
                <td class="td-std">
                    <div class="text-center">
                        <input type="checkbox" id="bingo-p3-h${i}-ba" class="bingo-checkbox" aria-label="Player 3 Bango Hole ${i}">
                    </div>
                </td>
                <td class="td-std">
                    <div class="text-center">
                        <input type="checkbox" id="bingo-p3-h${i}-bo" class="bingo-checkbox" aria-label="Player 3 Bongo Hole ${i}">
                    </div>
                </td>
                <td class="td-std">
                    <div class="text-center">
                        <input type="checkbox" id="bingo-p4-h${i}-bi" class="bingo-checkbox" aria-label="Player 4 Bingo Hole ${i}">
                    </div>
                </td>
                <td class="td-std">
                    <div class="text-center">
                        <input type="checkbox" id="bingo-p4-h${i}-ba" class="bingo-checkbox" aria-label="Player 4 Bango Hole ${i}">
                    </div>
                </td>
                <td class="td-std">
                    <div class="text-center">
                        <input type="checkbox" id="bingo-p4-h${i}-bo" class="bingo-checkbox" aria-label="Player 4 Bongo Hole ${i}">
                    </div>
                </td>
                <td class="td-std p1-cell" id="bingo-h${i}-p1-pts"></td>
                <td class="td-std p2-cell" id="bingo-h${i}-p2-pts"></td>
                <td class="td-std p3-cell" id="bingo-h${i}-p3-pts"></td>
                <td class="td-std p4-cell" id="bingo-h${i}-p4-pts"></td>
            </tr>`;
        
        // Add summary rows
        if (i === 9) {
            html += `
                <tr class="bg-gray-100 font-semibold">
                    <td class="td-std">OUT</td>
                    <td class="td-std" colspan="3" id="bingo-p1-out-marks"></td>
                    <td class="td-std" colspan="3" id="bingo-p2-out-marks"></td>
                    <td class="td-std" colspan="3" id="bingo-p3-out-marks"></td>
                    <td class="td-std" colspan="3" id="bingo-p4-out-marks"></td>
                    <td class="td-std p1-cell" id="bingo-p1-out-pts"></td>
                    <td class="td-std p2-cell" id="bingo-p2-out-pts"></td>
                    <td class="td-std p3-cell" id="bingo-p3-out-pts"></td>
                    <td class="td-std p4-cell" id="bingo-p4-out-pts"></td>
                </tr>`;
        } else if (i === 18) {
            html += `
                <tr class="bg-gray-100 font-semibold">
                    <td class="td-std">IN</td>
                    <td class="td-std" colspan="3" id="bingo-p1-in-marks"></td>
                    <td class="td-std" colspan="3" id="bingo-p2-in-marks"></td>
                    <td class="td-std" colspan="3" id="bingo-p3-in-marks"></td>
                    <td class="td-std" colspan="3" id="bingo-p4-in-marks"></td>
                    <td class="td-std p1-cell" id="bingo-p1-in-pts"></td>
                    <td class="td-std p2-cell" id="bingo-p2-in-pts"></td>
                    <td class="td-std p3-cell" id="bingo-p3-in-pts"></td>
                    <td class="td-std p4-cell" id="bingo-p4-in-pts"></td>
                </tr>
                <tr class="bg-gray-200 font-bold">
                    <td class="td-std">TOTAL</td>
                    <td class="td-std" colspan="3" id="bingo-p1-total-marks"></td>
                    <td class="td-std" colspan="3" id="bingo-p2-total-marks"></td>
                    <td class="td-std" colspan="3" id="bingo-p3-total-marks"></td>
                    <td class="td-std" colspan="3" id="bingo-p4-total-marks"></td>
                    <td class="td-std p1-cell" id="bingo-p1-total-pts"></td>
                    <td class="td-std p2-cell" id="bingo-p2-total-pts"></td>
                    <td class="td-std p3-cell" id="bingo-p3-total-pts"></td>
                    <td class="td-std p4-cell" id="bingo-p4-total-pts"></td>
                </tr>`;
        }
    }
    
    if (tbody) tbody.innerHTML = html;
}

/**
 * Initialize Bingo: Add listeners for player name changes and checkbox restrictions
 */
function initializeBingo() {
    console.log("Initializing Bingo Bango Bongo");
    
    // Update header names when players change
    const playerInputs = [];
    const playerHeaders = [];
    
    for (let i = 1; i <= 4; i++) {
        playerInputs.push(document.getElementById(`bingo-p${i}-name`));
        for (let j = 0; j < 3; j++) {
            const bbbType = j === 0 ? 'bi' : (j === 1 ? 'ba' : 'bo');
            playerHeaders.push(document.getElementById(`bingo-th-p${i}-${bbbType}`));
        }
    }
    
    const updateHeaders = () => {
        for (let i = 0; i < 4; i++) {
            const playerName = playerInputs[i]?.value || `P${i+1}`;
            for (let j = 0; j < 3; j++) {
                const headerIndex = i * 3 + j;
                if (playerHeaders[headerIndex]) {
                    const shortName = playerName.split(' ')[0]; // Use first name for column headers
                    playerHeaders[headerIndex].textContent = shortName;
                }
            }
        }
        
        // Update settlement display names
        updateBingoSettlement();
    };
    
    playerInputs.forEach(input => {
        if (input) input.addEventListener('input', updateHeaders);
    });
    
    // Add listener for point value changes
    document.getElementById('bingo-point-value')?.addEventListener('input', updateBingo);
    
    // Generate rows if needed
    generateBingoRows();
    
    // Add event handlers to checkboxes (after generation)
    for (let i = 1; i <= 18; i++) {
        // Each type of point (Bingo, Bango, Bongo) can only be awarded once per hole
        const biCheckboxes = [];
        const baCheckboxes = [];
        const boCheckboxes = [];
        
        for (let p = 1; p <= 4; p++) {
            biCheckboxes.push(document.getElementById(`bingo-p${p}-h${i}-bi`));
            baCheckboxes.push(document.getElementById(`bingo-p${p}-h${i}-ba`));
            boCheckboxes.push(document.getElementById(`bingo-p${p}-h${i}-bo`));
        }
        
        // Enforce exclusivity for each type of mark
        const enforceExclusivity = (checkboxes, changedIndex) => {
            for (let j = 0; j < checkboxes.length; j++) {
                if (j !== changedIndex && checkboxes[j].checked) {
                    checkboxes[j].checked = false;
                }
            }
            updateBingo(); // Recalculate after change
        };
        
        // Add event listeners to each checkbox
        for (let p = 0; p < 4; p++) {
            if (biCheckboxes[p]) {
                biCheckboxes[p].addEventListener('change', function() {
                    if (this.checked) {
                        enforceExclusivity(biCheckboxes, p);
                    } else {
                        updateBingo();
                    }
                });
            }
            
            if (baCheckboxes[p]) {
                baCheckboxes[p].addEventListener('change', function() {
                    if (this.checked) {
                        enforceExclusivity(baCheckboxes, p);
                    } else {
                        updateBingo();
                    }
                });
            }
            
            if (boCheckboxes[p]) {
                boCheckboxes[p].addEventListener('change', function() {
                    if (this.checked) {
                        enforceExclusivity(boCheckboxes, p);
                    } else {
                        updateBingo();
                    }
                });
            }
        }
    }
}

/**
 * Reset Bingo Display: Clear calculated values in the UI
 */
function resetBingoDisplay() {
    console.log("Reset Bingo Display");
    
    // Uncheck all checkboxes
    for (let i = 1; i <= 18; i++) {
        for (let p = 1; p <= 4; p++) {
            document.getElementById(`bingo-p${p}-h${i}-bi`)?.checked = false;
            document.getElementById(`bingo-p${p}-h${i}-ba`)?.checked = false;
            document.getElementById(`bingo-p${p}-h${i}-bo`)?.checked = false;
            
            // Reset point cells
            document.getElementById(`bingo-h${i}-p${p}-pts`)?.textContent = '';
        }
    }
    
    // Reset summary fields
    for (let p = 1; p <= 4; p++) {
        document.getElementById(`bingo-p${p}-out-marks`)?.textContent = '';
        document.getElementById(`bingo-p${p}-in-marks`)?.textContent = '';
        document.getElementById(`bingo-p${p}-total-marks`)?.textContent = '';
        document.getElementById(`bingo-p${p}-out-pts`)?.textContent = '';
        document.getElementById(`bingo-p${p}-in-pts`)?.textContent = '';
        document.getElementById(`bingo-p${p}-total-pts`)?.textContent = '';
    }
    
    // Reset headers
    for (let p = 1; p <= 4; p++) {
        document.getElementById(`bingo-th-p${p}-bi`)?.textContent = `Bi`;
        document.getElementById(`bingo-th-p${p}-ba`)?.textContent = `Ba`;
        document.getElementById(`bingo-th-p${p}-bo`)?.textContent = `Bo`;
    }
    
    // Reset settlement area
    for (let p = 1; p <= 4; p++) {
        document.getElementById(`bingo-settle-p${p}-name`)?.textContent = `Player ${p}:`;
        document.getElementById(`bingo-settle-p${p}-points`)?.textContent = '0';
        document.getElementById(`bingo-settle-p${p}-winnings`)?.textContent = '0.00';
    }
    document.getElementById('bingo-settlement-summary-text')?.textContent = '';
}

/**
 * Populate Bingo inputs from state
 */
function populateBingo() {
    console.log("Populate Bingo");
    if (!currentRoundState || currentRoundState.gameType !== 'bingo') return;
    
    // Player names
    for (let i = 0; i < 4; i++) {
        document.getElementById(`bingo-p${i+1}-name`).value = currentRoundState.players[i] || '';
        
        // Update headers with player names
        const playerName = currentRoundState.players[i] || `P${i+1}`;
        const shortName = playerName.split(' ')[0]; // Use first name for column headers
        document.getElementById(`bingo-th-p${i+1}-bi`).textContent = shortName;
        document.getElementById(`bingo-th-p${i+1}-ba`).textContent = shortName;
        document.getElementById(`bingo-th-p${i+1}-bo`).textContent = shortName;
    }
    
    // Options
    document.getElementById('bingo-point-value').value = currentRoundState.pointValue ?? 0.5;
    
    // Checkboxes
    for (let i = 0; i < 18; i++) {
        const hole = i + 1;
        
        for (let p = 1; p <= 4; p++) {
            const pKey = `p${p}`;
            
            if (currentRoundState.marks && currentRoundState.marks[pKey]) {
                document.getElementById(`bingo-${pKey}-h${hole}-bi`).checked = !!currentRoundState.marks[pKey].bi[i];
                document.getElementById(`bingo-${pKey}-h${hole}-ba`).checked = !!currentRoundState.marks[pKey].ba[i];
                document.getElementById(`bingo-${pKey}-h${hole}-bo`).checked = !!currentRoundState.marks[pKey].bo[i];
            }
        }
    }
    
    // Results will be populated by updateBingo
}

/**
 * Update Bingo: Calculate points for each player and update settlement
 */
function updateBingo() {
    console.log("Update Bingo");
    if (!currentRoundState || currentRoundState.gameType !== 'bingo') return;
    
    // --- 1. Read inputs into state ---
    currentRoundState.players = [];
    for (let i = 1; i <= 4; i++) {
        currentRoundState.players.push(document.getElementById(`bingo-p${i}-name`)?.value || '');
    }
    
    currentRoundState.pointValue = parseFloat(document.getElementById('bingo-point-value')?.value) || 0.5;
    
    // Read marks from checkboxes
    const marks = {
        p1: { bi: [], ba: [], bo: [] },
        p2: { bi: [], ba: [], bo: [] },
        p3: { bi: [], ba: [], bo: [] },
        p4: { bi: [], ba: [], bo: [] }
    };
    
    for (let i = 1; i <= 18; i++) {
        for (let p = 1; p <= 4; p++) {
            const pKey = `p${p}`;
            marks[pKey].bi.push(document.getElementById(`bingo-${pKey}-h${i}-bi`)?.checked || false);
            marks[pKey].ba.push(document.getElementById(`bingo-${pKey}-h${i}-ba`)?.checked || false);
            marks[pKey].bo.push(document.getElementById(`bingo-${pKey}-h${i}-bo`)?.checked || false);
        }
    }
    
    currentRoundState.marks = marks;
    
    // --- 2. Calculate points for each hole ---
    const pointsPerHole = Array(18).fill(null).map(() => [0, 0, 0, 0]);
    
    for (let i = 0; i < 18; i++) {
        // Check each type of mark (Bingo, Bango, Bongo)
        for (let p = 0; p < 4; p++) {
            const pKey = `p${p+1}`;
            
            // Add 1 point for each mark
            if (marks[pKey].bi[i]) pointsPerHole[i][p]++;
            if (marks[pKey].ba[i]) pointsPerHole[i][p]++;
            if (marks[pKey].bo[i]) pointsPerHole[i][p]++;
        }
    }
    
    // Store results in state
    currentRoundState.results = { pointsPerHole: pointsPerHole };
    
    // --- 3. Update UI ---
    // Update hole-by-hole points
    for (let i = 0; i < 18; i++) {
        const hole = i + 1;
        
        for (let p = 0; p < 4; p++) {
            const pointsCell = document.getElementById(`bingo-h${hole}-p${p+1}-pts`);
            const pointsValue = pointsPerHole[i][p];
            
            if (pointsCell) {
                pointsCell.textContent = pointsValue > 0 ? pointsValue : '';
                pointsCell.className = pointsValue > 0 ? 'td-std point-winner' : 'td-std';
            }
        }
    }
    
    // Calculate and display summary statistics
    const outMarks = [0, 0, 0, 0];
    const inMarks = [0, 0, 0, 0];
    const totalMarks = [0, 0, 0, 0];
    const outPoints = [0, 0, 0, 0];
    const inPoints = [0, 0, 0, 0];
    const totalPoints = [0, 0, 0, 0];
    
    for (let i = 0; i < 18; i++) {
        const holeNum = i + 1;
        
        for (let p = 0; p < 4; p++) {
            const pKey = `p${p+1}`;
            
            // Count marks (bi + ba + bo)
            const holeMarks = (marks[pKey].bi[i] ? 1 : 0) + 
                             (marks[pKey].ba[i] ? 1 : 0) + 
                             (marks[pKey].bo[i] ? 1 : 0);
            
            if (holeNum <= 9) {
                outMarks[p] += holeMarks;
                outPoints[p] += pointsPerHole[i][p];
            } else {
                inMarks[p] += holeMarks;
                inPoints[p] += pointsPerHole[i][p];
            }
            
            totalMarks[p] += holeMarks;
            totalPoints[p] += pointsPerHole[i][p];
        }
    }
    
    // Update summary row cells
    for (let p = 0; p < 4; p++) {
        // Display mark counts
        document.getElementById(`bingo-p${p+1}-out-marks`).textContent = outMarks[p] > 0 ? outMarks[p] : '';
        document.getElementById(`bingo-p${p+1}-in-marks`).textContent = inMarks[p] > 0 ? inMarks[p] : '';
        document.getElementById(`bingo-p${p+1}-total-marks`).textContent = totalMarks[p] > 0 ? totalMarks[p] : '';
        
        // Points summary
        document.getElementById(`bingo-p${p+1}-out-pts`).textContent = outPoints[p] || '';
        document.getElementById(`bingo-p${p+1}-in-pts`).textContent = inPoints[p] || '';
        document.getElementById(`bingo-p${p+1}-total-pts`).textContent = totalPoints[p] || '';
    }
    
    // Update settlement
    updateBingoSettlement(totalPoints);
}

/**
 * Update Bingo settlement information
 * @param {Array} totalPoints - Array of total points for each player
 */
function updateBingoSettlement(totalPoints = null) {
    if (!currentRoundState || currentRoundState.gameType !== 'bingo') return;
    
    // Use provided points or get from state
    const points = totalPoints || (currentRoundState.results?.pointsPerHole || []).reduce((acc, hole) => {
        return acc.map((sum, i) => sum + (hole[i] || 0));
    }, [0, 0, 0, 0]);
    
    // Calculate winnings based on point value
    const pointValue = currentRoundState.pointValue || 0.5;
    
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
        document.getElementById(`bingo-settle-p${p+1}-name`).textContent = `${currentRoundState.players[p] || `Player ${p+1}`}:`;
        document.getElementById(`bingo-settle-p${p+1}-points`).textContent = points[p] || '0';
        document.getElementById(`bingo-settle-p${p+1}-winnings`).textContent = formatCurrency(winnings[p] || 0).replace(', '');
    }
    
    document.getElementById('bingo-settlement-summary-text').textContent = settlement.summaryText;
}
