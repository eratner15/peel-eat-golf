
/**
 * Game Implementation: BLOODSOME
 * 
 * Bloodsome (or Bloodsome Chapman) is a team game for 4 players (2 teams of 2):
 * - Each team alternates who tees off on each hole
 * - After the tee shots, teammates select which ball to play for the remainder of the hole
 * - Teams then play alternate shots until the ball is holed
 * - The match is scored like match play, with each hole won, lost, or halved
 */

/**
 * Generate Bloodsome scorecard rows
 */
function generateBloodsomeRows() {
    const tbody = document.getElementById('bloodsome-scorecard-body');
    if (!tbody || tbody.children.length > 0) return; // Already populated
    
    let html = '';
    
    for (let i = 1; i <= 18; i++) {
        html += `
            <tr id="bloodsome-row-h${i}">
                <td class="td-std font-medium">${i}</td>
                <td class="td-std">
                    <select id="bloodsome-t1-h${i}-drive" class="input-std" aria-label="Team 1 Drive Selection Hole ${i}">
                        <option value=""></option>
                        <option value="pA">Player A</option>
                        <option value="pB">Player B</option>
                    </select>
                </td>
                <td class="td-std"><input type="number" id="bloodsome-t1-h${i}-score" min="1" class="input-std input-score" aria-label="Team 1 Score Hole ${i}"></td>
                <td class="td-std">
                    <select id="bloodsome-t2-h${i}-drive" class="input-std" aria-label="Team 2 Drive Selection Hole ${i}">
                        <option value=""></option>
                        <option value="pC">Player C</option>
                        <option value="pD">Player D</option>
                    </select>
                </td>
                <td class="td-std"><input type="number" id="bloodsome-t2-h${i}-score" min="1" class="input-std input-score" aria-label="Team 2 Score Hole ${i}"></td>
                <td class="td-std text-gray-500" id="bloodsome-h${i}-result"></td>
                <td class="td-std font-semibold" id="bloodsome-h${i}-status"></td>
            </tr>`;
        
        // Add summary rows
        if (i === 9) {
            html += `
                <tr class="bg-gray-100 font-semibold">
                    <td class="td-std">OUT</td>
                    <td class="td-std" id="bloodsome-t1-out-drives"></td>
                    <td class="td-std" id="bloodsome-t1-out-score"></td>
                    <td class="td-std" id="bloodsome-t2-out-drives"></td>
                    <td class="td-std" id="bloodsome-t2-out-score"></td>
                    <td class="td-std">Front 9:</td>
                    <td class="td-std" id="bloodsome-front9-status"></td>
                </tr>`;
        } else if (i === 18) {
            html += `
                <tr class="bg-gray-100 font-semibold">
                    <td class="td-std">IN</td>
                    <td class="td-std" id="bloodsome-t1-in-drives"></td>
                    <td class="td-std" id="bloodsome-t1-in-score"></td>
                    <td class="td-std" id="bloodsome-t2-in-drives"></td>
                    <td class="td-std" id="bloodsome-t2-in-score"></td>
                    <td class="td-std">Back 9:</td>
                    <td class="td-std" id="bloodsome-back9-status"></td>
                </tr>
                <tr class="bg-gray-200 font-bold">
                    <td class="td-std">TOTAL</td>
                    <td class="td-std" id="bloodsome-t1-total-drives"></td>
                    <td class="td-std" id="bloodsome-t1-total-score"></td>
                    <td class="td-std" id="bloodsome-t2-total-drives"></td>
                    <td class="td-std" id="bloodsome-t2-total-score"></td>
                    <td class="td-std">Overall:</td>
                    <td class="td-std" id="bloodsome-overall-status"></td>
                </tr>`;
        }
    }
    
    if (tbody) tbody.innerHTML = html;
}

/**
 * Initialize Bloodsome: Add listeners for team name changes and driver selection
 */
function initializeBloodsome() {
    console.log("Initializing Bloodsome");
    
    // Update header names when team members change
    const playerInputs = [
        document.getElementById('bloodsome-pA-name'),
        document.getElementById('bloodsome-pB-name'),
        document.getElementById('bloodsome-pC-name'),
        document.getElementById('bloodsome-pD-name')
    ];
    
    const t1Header = document.getElementById('bloodsome-th-t1');
    const t2Header = document.getElementById('bloodsome-th-t2');
    
    const updateHeaders = () => {
        const pA = playerInputs[0]?.value || 'A';
        const pB = playerInputs[1]?.value || 'B';
        const pC = playerInputs[2]?.value || 'C';
        const pD = playerInputs[3]?.value || 'D';
        
        if (t1Header) t1Header.textContent = `Team 1 (${pA}/${pB})`;
        if (t2Header) t2Header.textContent = `Team 2 (${pC}/${pD})`;
        
        // Update drop-down options for driver selection
        for (let i = 1; i <= 18; i++) {
            const t1DriveSelect = document.getElementById(`bloodsome-t1-h${i}-drive`);
            const t2DriveSelect = document.getElementById(`bloodsome-t2-h${i}-drive`);
            
            if (t1DriveSelect) {
                t1DriveSelect.options[1].text = pA;
                t1DriveSelect.options[2].text = pB;
            }
            
            if (t2DriveSelect) {
                t2DriveSelect.options[1].text = pC;
                t2DriveSelect.options[2].text = pD;
            }
        }
        
        updateBloodsomeSettlement();
    };
    
    playerInputs.forEach(input => {
        if (input) input.addEventListener('input', updateHeaders);
    });
    
    // Add listener for wager amount changes
    document.getElementById('bloodsome-wager')?.addEventListener('input', updateBloodsome);
    
    // Generate rows if needed
    generateBloodsomeRows();
    
    // Add auto-allocation for driver selection based on hole number
    for (let i = 1; i <= 18; i++) {
        // For odd holes, suggest player A from team 1 and player C from team 2
        // For even holes, suggest player B from team 1 and player D from team 2
        const isOdd = i % 2 === 1;
        const t1Driver = document.getElementById(`bloodsome-t1-h${i}-drive`);
        const t2Driver = document.getElementById(`bloodsome-t2-h${i}-drive`);
        
        if (t1Driver && t1Driver.value === '') {
            t1Driver.value = isOdd ? 'pA' : 'pB';
        }
        
        if (t2Driver && t2Driver.value === '') {
            t2Driver.value = isOdd ? 'pC' : 'pD';
        }
        
        // Add listeners for score inputs and drive selections
        document.getElementById(`bloodsome-t1-h${i}-score`)?.addEventListener('input', updateBloodsome);
        document.getElementById(`bloodsome-t2-h${i}-score`)?.addEventListener('input', updateBloodsome);
        t1Driver?.addEventListener('change', updateBloodsome);
        t2Driver?.addEventListener('change', updateBloodsome);
    }
}

/**
 * Reset Bloodsome Display: Clear calculated values in the UI
 */
function resetBloodsomeDisplay() {
    console.log("Reset Bloodsome Display");
    
    // Reset hole-by-hole display
    for (let i = 1; i <= 18; i++) {
        // Reset result and status
        document.getElementById(`bloodsome-h${i}-result`).textContent = '';
        const statusCell = document.getElementById(`bloodsome-h${i}-status`);
        statusCell.textContent = '';
        statusCell.className = 'td-std font-semibold';
    }
    
    // Reset summary fields
    document.getElementById('bloodsome-t1-out-drives').textContent = '';
    document.getElementById('bloodsome-t1-in-drives').textContent = '';
    document.getElementById('bloodsome-t1-total-drives').textContent = '';
    document.getElementById('bloodsome-t1-out-score').textContent = '';
    document.getElementById('bloodsome-t1-in-score').textContent = '';
    document.getElementById('bloodsome-t1-total-score').textContent = '';
    
    document.getElementById('bloodsome-t2-out-drives').textContent = '';
    document.getElementById('bloodsome-t2-in-drives').textContent = '';
    document.getElementById('bloodsome-t2-total-drives').textContent = '';
    document.getElementById('bloodsome-t2-out-score').textContent = '';
    document.getElementById('bloodsome-t2-in-score').textContent = '';
    document.getElementById('bloodsome-t2-total-score').textContent = '';
    
    document.getElementById('bloodsome-front9-status').textContent = '';
    document.getElementById('bloodsome-back9-status').textContent = '';
    document.getElementById('bloodsome-overall-status').textContent = '';
    
    // Reset headers
    document.getElementById('bloodsome-th-t1').textContent = 'Team 1';
    document.getElementById('bloodsome-th-t2').textContent = 'Team 2';
    
    // Reset settlement section
    document.getElementById('bloodsome-settlement-winner').textContent = '--';
    document.getElementById('bloodsome-settlement-status').textContent = '--';
    document.getElementById('bloodsome-settlement-amount').textContent = '$0.00';
    document.getElementById('bloodsome-settlement-summary-text').textContent = '';
    
    // Auto-select drivers based on odd/even hole
    for (let i = 1; i <= 18; i++) {
        const isOdd = i % 2 === 1;
        document.getElementById(`bloodsome-t1-h${i}-drive`).value = isOdd ? 'pA' : 'pB';
        document.getElementById(`bloodsome-t2-h${i}-drive`).value = isOdd ? 'pC' : 'pD';
    }
}

/**
 * Populate Bloodsome inputs from state
 */
function populateBloodsome() {
    console.log("Populate Bloodsome");
    if (!currentRoundState || currentRoundState.gameType !== 'bloodsome') return;
    
    // Team member names
    document.getElementById('bloodsome-pA-name').value = currentRoundState.teams?.t1?.pA || '';
    document.getElementById('bloodsome-pB-name').value = currentRoundState.teams?.t1?.pB || '';
    document.getElementById('bloodsome-pC-name').value = currentRoundState.teams?.t2?.pC || '';
    document.getElementById('bloodsome-pD-name').value = currentRoundState.teams?.t2?.pD || '';
    
    // Update headers
    const pA = currentRoundState.teams?.t1?.pA || 'A';
    const pB = currentRoundState.teams?.t1?.pB || 'B';
    const pC = currentRoundState.teams?.t2?.pC || 'C';
    const pD = currentRoundState.teams?.t2?.pD || 'D';
    
    document.getElementById('bloodsome-th-t1').textContent = `Team 1 (${pA}/${pB})`;
    document.getElementById('bloodsome-th-t2').textContent = `Team 2 (${pC}/${pD})`;
    
    // Wager
    document.getElementById('bloodsome-wager').value = currentRoundState.wager ?? 10;
    
    // Scores and drives
    for (let i = 0; i < 18; i++) {
        const hole = i + 1;
        
        // Drive selections
        const t1Drive = document.getElementById(`bloodsome-t1-h${hole}-drive`);
        const t2Drive = document.getElementById(`bloodsome-t2-h${hole}-drive`);
        
        if (t1Drive) {
            t1Drive.value = currentRoundState.drives?.t1[i] || (i % 2 === 0 ? 'pA' : 'pB');
            // Update options with player names
            t1Drive.options[1].text = pA;
            t1Drive.options[2].text = pB;
        }
        
        if (t2Drive) {
            t2Drive.value = currentRoundState.drives?.t2[i] || (i % 2 === 0 ? 'pC' : 'pD');
            // Update options with player names
            t2Drive.options[1].text = pC;
            t2Drive.options[2].text = pD;
        }
        
        // Scores
        const t1ScoreInput = document.getElementById(`bloodsome-t1-h${hole}-score`);
        const t2ScoreInput = document.getElementById(`bloodsome-t2-h${hole}-score`);
        
        if (t1ScoreInput) {
            const score = currentRoundState.scores?.t1[i];
            t1ScoreInput.value = score !== null ? score : '';
        }
        
        if (t2ScoreInput) {
            const score = currentRoundState.scores?.t2[i];
            t2ScoreInput.value = score !== null ? score : '';
        }
    }
    
    // Results will be calculated by updateBloodsome
}

/**
 * Update Bloodsome: Calculate match status and settlement
 */
function updateBloodsome() {
    console.log("Update Bloodsome");
    if (!currentRoundState || currentRoundState.gameType !== 'bloodsome') return;
    
    // --- 1. Read inputs into state ---
    // Team members
    currentRoundState.teams = {
        t1: {
            pA: document.getElementById('bloodsome-pA-name')?.value || '',
            pB: document.getElementById('bloodsome-pB-name')?.value || ''
        },
        t2: {
            pC: document.getElementById('bloodsome-pC-name')?.value || '',
            pD: document.getElementById('bloodsome-pD-name')?.value || ''
        }
    };
    
    currentRoundState.wager = parseFloat(document.getElementById('bloodsome-wager')?.value) || 10;
    
    // Read drives and scores
    const drives = { t1: [], t2: [] };
    const scores = { t1: [], t2: [] };
    
    for (let i = 1; i <= 18; i++) {
        // Drives
        drives.t1.push(document.getElementById(`bloodsome-t1-h${i}-drive`)?.value || '');
        drives.t2.push(document.getElementById(`bloodsome-t2-h${i}-drive`)?.value || '');
        
        // Scores
        const t1Score = document.getElementById(`bloodsome-t
