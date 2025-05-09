
/**
 * Game Implementation: VEGAS
 */

/**
 * Initialize Vegas: Add listeners for team name changes
 */
function initializeVegas() {
    console.log("Init Vegas");
    
    // Listener for Team 1 names
    const t1Header = document.getElementById('vegas-th-t1');
    const pAInput = document.getElementById('vegas-pA-name');
    const pBInput = document.getElementById('vegas-pB-name');
    const pAHeader = document.getElementById('vegas-th-pA');
    const pBHeader = document.getElementById('vegas-th-pB');
    
    const updateT1Names = () => {
        const pA = pAInput?.value || 'A';
        const pB = pBInput?.value || 'B';
        if (t1Header) t1Header.textContent = `Team 1 (${pA}/${pB})`;
        if (pAHeader) pAHeader.textContent = `Score ${pA}`;
        if (pBHeader) pBHeader.textContent = `Score ${pB}`;
        updateVegas(); // Recalculate if names change affects settlement display
    };
    
    pAInput?.addEventListener('input', updateT1Names);
    pBInput?.addEventListener('input', updateT1Names);

    // Listener for Team 2 names
    const t2Header = document.getElementById('vegas-th-t2');
    const pCInput = document.getElementById('vegas-pC-name');
    const pDInput = document.getElementById('vegas-pD-name');
    const pCHeader = document.getElementById('vegas-th-pC');
    const pDHeader = document.getElementById('vegas-th-pD');
    
    const updateT2Names = () => {
        const pC = pCInput?.value || 'C';
        const pD = pDInput?.value || 'D';
        if (t2Header) t2Header.textContent = `Team 2 (${pC}/${pD})`;
        if (pCHeader) pCHeader.textContent = `Score ${pC}`;
        if (pDHeader) pDHeader.textContent = `Score ${pD}`;
        updateVegas(); // Recalculate if names change affects settlement display
    };
    
    pCInput?.addEventListener('input', updateT2Names);
    pDInput?.addEventListener('input', updateT2Names);
    
    // Listeners for point value changes
    document.getElementById('vegas-point-value')?.addEventListener('input', updateVegas);
    
    // Generate scorecard rows if needed
    generateVegasRows();
    
    // Add input event listeners to all score inputs
    for (let i = 1; i <= 18; i++) {
        document.getElementById(`vegas-pA-h${i}-score`)?.addEventListener('input', updateVegas);
        document.getElementById(`vegas-pB-h${i}-score`)?.addEventListener('input', updateVegas);
        document.getElementById(`vegas-pC-h${i}-score`)?.addEventListener('input', updateVegas);
        document.getElementById(`vegas-pD-h${i}-score`)?.addEventListener('input', updateVegas);
    }
}

/**
 * Generate Vegas scorecard rows
 */
function generateVegasRows() {
    const tbody = document.getElementById('vegas-scorecard-body');
    if (!tbody || tbody.children.length > 0) return; // Already populated
    
    let html = '';
    
    for (let i = 1; i <= 18; i++) {
        html += `
            <tr id="vegas-row-h${i}">
                <td class="td-std font-medium">${i}</td>
                <td class="td-std"><input type="number" id="vegas-pA-h${i}-score" min="1" max="20" class="input-std input-score" aria-label="Player A Score Hole ${i}"></td>
                <td class="td-std"><input type="number" id="vegas-pB-h${i}-score" min="1" max="20" class="input-std input-score" aria-label="Player B Score Hole ${i}"></td>
                <td class="td-std"><input type="number" id="vegas-pC-h${i}-score" min="1" max="20" class="input-std input-score" aria-label="Player C Score Hole ${i}"></td>
                <td class="td-std"><input type="number" id="vegas-pD-h${i}-score" min="1" max="20" class="input-std input-score" aria-label="Player D Score Hole ${i}"></td>
                <td class="td-std vegas-number" id="vegas-h${i}-t1-num"></td>
                <td class="td-std vegas-number" id="vegas-h${i}-t2-num"></td>
                <td class="td-std font-semibold" id="vegas-h${i}-diff"></td>
            </tr>`;
        
        // Add summary rows
        if (i === 9) {
            html += `
                <tr class="bg-gray-100 font-semibold">
                    <td class="td-std">OUT</td>
                    <td id="vegas-pA-out-score" class="td-std"></td>
                    <td id="vegas-pB-out-score" class="td-std"></td>
                    <td id="vegas-pC-out-score" class="td-std"></td>
                    <td id="vegas-pD-out-score" class="td-std"></td>
                    <td class="td-std" colspan="2"></td>
                    <td id="vegas-out-diff" class="td-std font-bold"></td>
                </tr>`;
        } else if (i === 18) {
            html += `
                <tr class="bg-gray-100 font-semibold">
                    <td class="td-std">IN</td>
                    <td id="vegas-pA-in-score" class="td-std"></td>
                    <td id="vegas-pB-in-score" class="td-std"></td>
                    <td id="vegas-pC-in-score" class="td-std"></td>
                    <td id="vegas-pD-in-score" class="td-std"></td>
                    <td class="td-std" colspan="2"></td>
                    <td id="vegas-in-diff" class="td-std font-bold"></td>
                </tr>
                <tr class="bg-gray-200 font-bold">
                    <td class="td-std">TOTAL</td>
                    <td id="vegas-pA-total-score" class="td-std"></td>
                    <td id="vegas-pB-total-score" class="td-std"></td>
                    <td id="vegas-pC-total-score" class="td-std"></td>
                    <td id="vegas-pD-total-score" class="td-std"></td>
                    <td class="td-std" colspan="2"></td>
                    <td id="vegas-total-diff" class="td-std font-extrabold"></td>
                </tr>`;
        }
    }
    
    if (tbody) tbody.innerHTML = html;
}

/**
 * Reset Vegas Display: Clear calculated values in the UI
 */
function resetVegasDisplay() {
    console.log("Reset Vegas Display");
    
    // Clear hole-by-hole team numbers and diffs
    for (let i = 1; i <= 18; i++) {
        document.getElementById(`vegas-h${i}-t1-num`)?.textContent = '';
        document.getElementById(`vegas-h${i}-t2-num`)?.textContent = '';
        const diffCell = document.getElementById(`vegas-h${i}-diff`);
        if(diffCell) {
            diffCell.textContent = '';
            diffCell.className = 'td-std font-semibold'; // Reset class
        }
    }
    
    // Clear summary rows
    document.getElementById('vegas-out-diff')?.textContent = '';
    document.getElementById('vegas-in-diff')?.textContent = '';
    document.getElementById('vegas-total-diff')?.textContent = '';
    document.getElementById('vegas-total-diff')?.className = 'td-std font-extrabold'; // Reset class

    // Clear settlement text
    document.getElementById('vegas-settlement-summary-text')?.textContent = 'Team -- owes Team -- $0.00';

    // Reset headers
    document.getElementById('vegas-th-t1')?.textContent = 'Team 1';
    document.getElementById('vegas-th-t2')?.textContent = 'Team 2';
    document.getElementById('vegas-th-pA')?.textContent = 'Score A';
    document.getElementById('vegas-th-pB')?.textContent = 'Score B';
    document.getElementById('vegas-th-pC')?.textContent = 'Score C';
    document.getElementById('vegas-th-pD')?.textContent = 'Score D';
    
    // Clear player score summary cells
    document.getElementById('vegas-pA-out-score')?.textContent = '';
    document.getElementById('vegas-pA-in-score')?.textContent = '';
    document.getElementById('vegas-pA-total-score')?.textContent = '';
    
    document.getElementById('vegas-pB-out-score')?.textContent = '';
    document.getElementById('vegas-pB-in-score')?.textContent = '';
    document.getElementById('vegas-pB-total-score')?.textContent = '';
    
    document.getElementById('vegas-pC-out-score')?.textContent = '';
    document.getElementById('vegas-pC-in-score')?.textContent = '';
    document.getElementById('vegas-pC-total-score')?.textContent = '';
    
    document.getElementById('vegas-pD-out-score')?.textContent = '';
    document.getElementById('vegas-pD-in-score')?.textContent = '';
    document.getElementById('vegas-pD-total-score')?.textContent = '';
}

/**
 * Populate Vegas inputs from state
 */
function populateVegas() {
    console.log("Populate Vegas");
    if (!currentRoundState || currentRoundState.gameType !== 'vegas') return;

    // Populate setup fields
    document.getElementById('vegas-pA-name').value = currentRoundState.teams?.t1?.pA || '';
    document.getElementById('vegas-pB-name').value = currentRoundState.teams?.t1?.pB || '';
    document.getElementById('vegas-pC-name').value = currentRoundState.teams?.t2?.pC || '';
    document.getElementById('vegas-pD-name').value = currentRoundState.teams?.t2?.pD || '';
    document.getElementById('vegas-point-value').value = currentRoundState.pointValue ?? 1;

    // Update headers immediately
    const pA = currentRoundState.teams?.t1?.pA || 'A';
    const pB = currentRoundState.teams?.t1?.pB || 'B';
    const pC = currentRoundState.teams?.t2?.pC || 'C';
    const pD = currentRoundState.teams?.t2?.pD || 'D';
    document.getElementById('vegas-th-t1').textContent = `Team 1 (${pA}/${pB})`;
    document.getElementById('vegas-th-t2').textContent = `Team 2 (${pC}/${pD})`;
    document.getElementById('vegas-th-pA').textContent = `Score ${pA}`;
    document.getElementById('vegas-th-pB').textContent = `Score ${pB}`;
    document.getElementById('vegas-th-pC').textContent = `Score ${pC}`;
    document.getElementById('vegas-th-pD').textContent = `Score ${pD}`;

    // Populate individual scores
    const players = ['pA', 'pB', 'pC', 'pD'];
    for (let i = 0; i < 18; i++) {
        players.forEach(pKey => {
            const scoreInput = document.getElementById(`vegas-${pKey}-h${i + 1}-score`);
            if (scoreInput) scoreInput.value = currentRoundState.scores?.[pKey]?.[i] ?? '';
        });
    }
    
    // Run calculation to update Vegas numbers and summary displays
    updateVegas();
}

/**
 * Helper to calculate Vegas team number (low score * 10 + high score)
 * @param {number} score1 - First player's score
 * @param {number} score2 - Second player's score
 * @returns {number|null} - Vegas team number or null if scores not complete
 */
function calculateVegasTeamNumber(score1, score2) {
    if (score1 === null || score2 === null) return null;
    const low = Math.min(score1, score2);
    const high = Math.max(score1, score2);
    // Create the combined number (e.g., 45 for low=4, high=5)
    return low * 10 + high;
}

/**
 * Update Vegas: Calculate team numbers, points difference, settlement, and update UI
 */
function updateVegas() {
    console.log("Update Vegas");
    if (!currentRoundState || currentRoundState.gameType !== 'vegas') return;

    // --- 1. Read Inputs into State ---
    currentRoundState.teams = {
        t1: {
            pA: document.getElementById('vegas-pA-name')?.value || '',
            pB: document.getElementById('vegas-pB-name')?.value || ''
        },
        t2: {
            pC: document.getElementById('vegas-pC-name')?.value || '',
            pD: document.getElementById('vegas-pD-name')?.value || ''
        }
    };
    
    currentRoundState.pointValue = parseFloat(document.getElementById('vegas-point-value')?.value) || 1;

    let scores = { pA: [], pB: [], pC: [], pD: [] };
    let totalScores = { pA: 0, pB: 0, pC: 0, pD: 0 };
    let outScores = { pA: 0, pB: 0, pC: 0, pD: 0 };
    let inScores = { pA: 0, pB: 0, pC: 0, pD: 0 };
    const players = ['pA', 'pB', 'pC', 'pD'];

    for (let i = 0; i < 18; i++) {
        players.forEach(pKey => {
            const scoreVal = document.getElementById(`vegas-${pKey}-h${i + 1}-score`)?.value;
            const score = scoreVal === '' ? null : parseInt(scoreVal);
            scores[pKey][i] = score;
            
            if (score !== null) {
                totalScores[pKey] += score;
                if (i < 9) outScores[pKey] += score; else inScores[pKey] += score;
            }
        });
    }
    currentRoundState.scores = scores;

    // --- 2. Calculate Vegas Numbers and Points Difference ---
    let results = { t1Num: Array(18).fill(null), t2Num: Array(18).fill(null), diff: Array(18).fill(0) };
    let totalDiff = 0;
    let outDiff = 0;
    let inDiff = 0;

    for (let i = 0; i < 18; i++) {
        const hole = i + 1;
        const scoreA = scores.pA[i];
        const scoreB = scores.pB[i];
        const scoreC = scores.pC[i];
        const scoreD = scores.pD[i];

        const t1Num = calculateVegasTeamNumber(scoreA, scoreB);
        const t2Num = calculateVegasTeamNumber(scoreC, scoreD);
        results.t1Num[i] = t1Num;
        results.t2Num[i] = t2Num;

        let holeDiff = 0;
        if (t1Num !== null && t2Num !== null) {
            holeDiff = t2Num - t1Num; // Points won/lost by Team 1
            results.diff[i] = holeDiff;
            totalDiff += holeDiff;
            if (i < 9) outDiff += holeDiff; else inDiff += holeDiff;
        } else {
            results.diff[i] = 0; // No difference if scores incomplete
        }

        // --- 3. Update UI for the hole ---
        document.getElementById(`vegas-h${hole}-t1-num`).textContent = t1Num ?? '--';
        document.getElementById(`vegas-h${hole}-t2-num`).textContent = t2Num ?? '--';
        const diffCell = document.getElementById(`vegas-h${hole}-diff`);
        if (diffCell) {
            diffCell.textContent = (t1Num !== null && t2Num !== null) ? holeDiff : '';
            diffCell.className = `td-std font-semibold ${getValueClass(holeDiff)}`;
        }
    }
    
    currentRoundState.results = results;
    
    // --- 4. Update summary cells ---
    // Update player score totals
    players.forEach(pKey => {
        const player = pKey.charAt(1);
        document.getElementById(`vegas-${pKey}-out-score`).textContent = 
            Object.values(scores[pKey].slice(0, 9)).every(s => s === null) ? '' : 
            outScores[pKey];
        document.getElementById(`vegas-${pKey}-in-score`).textContent = 
            Object.values(scores[pKey].slice(9)).every(s => s === null) ? '' : 
            inScores[pKey];
        document.getElementById(`vegas-${pKey}-total-score`).textContent = 
            Object.values(scores[pKey]).every(s => s === null) ? '' : 
            totalScores[pKey];
    });
    
    // Update difference totals
    const outDiffCell = document.getElementById('vegas-out-diff');
    const inDiffCell = document.getElementById('vegas-in-diff');
    const totalDiffCell = document.getElementById('vegas-total-diff');
    
    outDiffCell.textContent = outDiff !== 0 ? outDiff : '';
    outDiffCell.className = `td-std font-bold ${getValueClass(outDiff)}`;
    
    inDiffCell.textContent = inDiff !== 0 ? inDiff : '';
    inDiffCell.className = `td-std font-bold ${getValueClass(inDiff)}`;
    
    totalDiffCell.textContent = totalDiff !== 0 ? totalDiff : '';
    totalDiffCell.className = `td-std font-extrabold ${getValueClass(totalDiff)}`;
    
    // --- 5. Calculate settlement ---
    // Create settlement information
    const pointValue = currentRoundState.pointValue;
    const settlement = {
        totalDiff: totalDiff,
        summaryText: ''
    };
    
    // Generate summary text based on total difference
    if (totalDiff === 0) {
        settlement.summaryText = 'Match Tied - no settlement needed';
    } else {
        const t1Names = `${currentRoundState.teams.t1.pA || 'A'}/${currentRoundState.teams.t1.pB || 'B'}`;
        const t2Names = `${currentRoundState.teams.t2.pC || 'C'}/${currentRoundState.teams.t2.pD || 'D'}`;
        const amount = Math.abs(totalDiff) * pointValue;
        
        if (totalDiff > 0) {
            settlement.summaryText = `Team ${t1Names} owes Team ${t2Names} ${formatCurrency(amount)}`;
        } else {
            settlement.summaryText = `Team ${t2Names} owes Team ${t1Names} ${formatCurrency(amount)}`;
        }
    }
    
    currentRoundState.settlement = settlement;
    
    // Update settlement display
    document.getElementById('vegas-settlement-summary-text').textContent = settlement.summaryText;
}
