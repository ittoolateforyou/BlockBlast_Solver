// ==============================
// Main Application
// ==============================

// DOM
const board = document.getElementById("board");

const pieces = [
    document.getElementById("piece-0"),
    document.getElementById("piece-1"),
    document.getElementById("piece-2")
];

const clearBtn = document.getElementById("clearBtn");
const solveBtn = document.getElementById("solveBtn");
const result = document.getElementById("result");
const nextBtn = document.getElementById("nextBtn");

const BOARD_SIZE = 8;
const PIECE_SIZE = 5;

// Global
window.board = board;
window.pieces = pieces;

// Lưu lời giải hiện tại
let currentSolution = null;

// ==============================
// Init
// ==============================

function initialize() {

    createGrid(board, BOARD_SIZE);

    pieces.forEach(piece => {
        createGrid(piece, PIECE_SIZE);
    });

    updateFilledCounter();
}

initialize();

// ==============================
// Clear
// ==============================

clearBtn.addEventListener("click", () => {

    clearGrid(board);

    pieces.forEach(piece => clearGrid(piece));

    currentSolution = null;

    result.classList.add("hidden");

    document.getElementById("solutionContent").innerHTML = "";

    document.getElementById("scoreText").textContent =
        "Best Score : 0";

    updateFilledCounter();
});

// ==============================
// Solve
// ==============================

solveBtn.addEventListener("click", () => {

    const boardState = getGrid(board, BOARD_SIZE);

    const pieceStates = pieces.map(piece =>
        normalizePiece(
            getGrid(piece, PIECE_SIZE)
        )
    );

    // Validate
    if (pieceStates.some(piece => piece.length === 0)) {
        alert("Please fill all 3 pieces.");
        return;
    }

    // Solve
    currentSolution = Solver.solve(boardState, pieceStates);

    if (!currentSolution) {
        alert("No valid moves found.");
        return;
    }

    // Render UI
    renderSolution(currentSolution);

    document.getElementById("scoreText").textContent =
        `Best Score : ${currentSolution.score}`;

    result.classList.remove("hidden");

    // Scroll xuống kết quả
    result.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});

// ==============================
// Next
// Lấy board của Step cuối
// ==============================

nextBtn.addEventListener("click", () => {

    if (!currentSolution) return;

    // Board sau Step 3
    const finalBoard =
        currentSolution.steps[
            currentSolution.steps.length - 1
        ].after;

    // Đổ lại lên Fill initial grid
    setBoardState(board, finalBoard);

    // Xóa 3 piece
    pieces.forEach(piece => clearGrid(piece));

    // Reset solver
    currentSolution = null;

    // Ẩn kết quả
    result.classList.add("hidden");

    document.getElementById("solutionContent").innerHTML = "";

    document.getElementById("scoreText").textContent =
        "Best Score : 0";

    updateFilledCounter();

    // Scroll lên đầu
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});

// ==============================
// Filled Counter
// ==============================

board.addEventListener("click", updateFilledCounter);