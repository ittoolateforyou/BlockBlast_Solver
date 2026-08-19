// ==============================
// UI MODULE
// ==============================

const filledCounter = document.getElementById("filledCount");
const solutionContent = document.getElementById("solutionContent");

// ==============================
// Create Grid
// ==============================

function createGrid(container, size) {
    container.innerHTML = "";

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {

            const cell = document.createElement("div");

            cell.className = "cell";
            cell.dataset.row = r;
            cell.dataset.col = c;

            cell.addEventListener("click", () => {
                cell.classList.toggle("active");

                if (container.id === "board") {
                    updateFilledCounter();
                }
            });

            container.appendChild(cell);
        }
    }
}

// ==============================
// Read Grid
// ==============================

function getGrid(container, size) {

    const cells = container.querySelectorAll(".cell");
    const grid = [];

    for (let r = 0; r < size; r++) {

        const row = [];

        for (let c = 0; c < size; c++) {

            const index = r * size + c;

            row.push(
                cells[index].classList.contains("active") ? 1 : 0
            );

        }

        grid.push(row);
    }

    return grid;
}

// ==============================
// Set Board State (NEXT)
// ==============================

function setBoardState(container, grid) {

    const cells = container.querySelectorAll(".cell");

    cells.forEach(cell =>
        cell.classList.remove("active")
    );

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {

            const index = r * 8 + c;

            if (grid[r][c]) {
                cells[index].classList.add("active");
            }

        }
    }

    updateFilledCounter();
}

// ==============================
// Clear Grid
// ==============================

function clearGrid(container) {
    container.querySelectorAll(".cell").forEach(cell => {
        cell.classList.remove("active");
    });
}

// ==============================
// Normalize Piece
// ==============================

function normalizePiece(piece) {

    const rows = [];
    const cols = [];

    piece.forEach((row, r) => {
        if (row.some(v => v)) rows.push(r);
    });

    if (rows.length === 0) return [];

    for (let c = 0; c < piece[0].length; c++) {

        let has = false;

        for (let r = 0; r < piece.length; r++) {

            if (piece[r][c]) {
                has = true;
                break;
            }

        }

        if (has) cols.push(c);

    }

    return rows.map(r =>
        cols.map(c => piece[r][c])
    );
}

// ==============================
// Filled Counter
// ==============================

function updateFilledCounter() {

    if (!window.board) return;

    const total =
        window.board.querySelectorAll(".cell.active").length;

    filledCounter.textContent = `${total} / 64`;
}

// ==============================
// Render Solution
// ==============================

function renderSolution(solution) {

    solutionContent.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.className = "steps-container";

    solution.steps.forEach((step, index) => {

        const card = document.createElement("div");
        card.className = "solution-step";

        card.innerHTML = `
            <div class="step-header">
                <h3>Step ${index + 1}</h3>

                <span>Piece ${step.piece + 1}</span>

                <p>Row ${step.row + 1} · Col ${step.col + 1}</p>

                <small>+${step.completed} line(s)</small>
            </div>

            <div class="solution-board"></div>
        `;

        drawSolutionBoard(
            card.querySelector(".solution-board"),
            step.before,
            step.after,
            step
        );

        wrapper.appendChild(card);

    });

    solutionContent.appendChild(wrapper);

    // Legend
    const legend = document.createElement("div");

    legend.className = "legend";

    legend.innerHTML = `
        <div class="legend-item">
            <div class="legend-color before"></div>
            Existing
        </div>

        <div class="legend-item">
            <div class="legend-color place"></div>
            Place
        </div>

        <div class="legend-item">
            <div class="legend-color clear"></div>
            Clear
        </div>
    `;

    solutionContent.appendChild(legend);
}

// ==============================
// Draw Solution Board
// ==============================

function drawSolutionBoard(container, before, after, step) {

    container.innerHTML = "";

    const placed = new Set();
    const cleared = new Set();

    // Piece vừa đặt
    step.cells.forEach(([r, c]) => {
        placed.add(`${r},${c}`);
    });

    // Ô bị clear
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {

            if (before[r][c] && !after[r][c]) {
                cleared.add(`${r},${c}`);
            }

        }
    }

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {

            const cell = document.createElement("div");
            cell.className = "solution-cell";

            const key = `${r},${c}`;

            if (before[r][c]) {
                cell.classList.add("before");
            }

            if (placed.has(key)) {
                cell.classList.remove("before");
                cell.classList.add("place");
            }

            if (cleared.has(key)) {
                cell.classList.remove("before", "place");
                cell.classList.add("clear");
            }

            container.appendChild(cell);

        }
    }
}