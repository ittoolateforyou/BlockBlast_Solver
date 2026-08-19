// ==============================
// Block Blast Solver V1
// Exhaustive DFS
// ==============================

const Solver = (() => {

    const SIZE = 8;

    // --------------------------
    // Public
    // --------------------------

    function solve(board, pieces) {

        const orders = permutations([0, 1, 2]);

        let best = {
            score: -Infinity,
            steps: []
        };

        for (const order of orders) {

            dfs(
                clone(board),
                pieces,
                order,
                0,
                [],
                best
            );

        }

        return best.steps.length ? best : null;
    }

    // --------------------------
    // DFS
    // --------------------------

    function dfs(
        board,
        pieces,
        order,
        depth,
        history,
        best
    ) {

        if (depth === 3) {

            const score = evaluate(board, history);

            if (score > best.score) {

                best.score = score;
                best.steps = history.map(step => ({
                    ...step,
                    before: clone(step.before),
                    after: clone(step.after)
                }));

            }

            return;
        }

        const pieceIndex = order[depth];
        const piece = pieces[pieceIndex];

        for (let r = 0; r < SIZE; r++) {

            for (let c = 0; c < SIZE; c++) {

                if (!canPlace(board, piece, r, c))
                    continue;

                const before = clone(board);

                const next = clone(board);

                const placedCells =
                    place(next, piece, r, c);

                const completed =
                    clearLines(next);

                history.push({
                    piece: pieceIndex,
                    row: r,
                    col: c,
                    cells: placedCells,
                    completed,
                    before,
                    after: clone(next)
                });

                dfs(
                    next,
                    pieces,
                    order,
                    depth + 1,
                    history,
                    best
                );

                history.pop();

            }

        }

    }

    // --------------------------
    // Can Place
    // --------------------------

    function canPlace(board, piece, row, col) {

        for (let r = 0; r < piece.length; r++) {

            for (let c = 0; c < piece[0].length; c++) {

                if (!piece[r][c]) continue;

                const y = row + r;
                const x = col + c;

                if (
                    y >= SIZE ||
                    x >= SIZE
                ) return false;

                if (board[y][x])
                    return false;

            }

        }

        return true;
    }

    // --------------------------
    // Place Piece
    // --------------------------

    function place(board, piece, row, col) {

        const cells = [];

        for (let r = 0; r < piece.length; r++) {

            for (let c = 0; c < piece[0].length; c++) {

                if (!piece[r][c]) continue;

                board[row + r][col + c] = 1;

                cells.push([
                    row + r,
                    col + c
                ]);

            }

        }

        return cells;
    }

    // --------------------------
    // Clear Full Rows / Cols
    // --------------------------

    function clearLines(board) {

        const rows = [];
        const cols = [];

        // Rows
        for (let r = 0; r < SIZE; r++) {

            if (board[r].every(v => v === 1))
                rows.push(r);

        }

        // Cols
        for (let c = 0; c < SIZE; c++) {

            let full = true;

            for (let r = 0; r < SIZE; r++) {

                if (!board[r][c]) {
                    full = false;
                    break;
                }

            }

            if (full)
                cols.push(c);

        }

        rows.forEach(r => {
            for (let c = 0; c < SIZE; c++)
                board[r][c] = 0;
        });

        cols.forEach(c => {
            for (let r = 0; r < SIZE; r++)
                board[r][c] = 0;
        });

        return rows.length + cols.length;
    }

    // --------------------------
    // Heuristic
    // --------------------------

    function evaluate(board, history) {

        let score = 0;

        // Remaining empty cells
        let empty = 0;

        for (let r = 0; r < SIZE; r++) {

            for (let c = 0; c < SIZE; c++) {

                if (!board[r][c])
                    empty++;

            }

        }

        score += empty * 2;

        // Reward line clears
        history.forEach(step => {
            score += step.completed * 120;
        });

        // Penalize isolated holes
        score -= countHoles(board) * 8;

        return score;
    }

    // --------------------------
    // Hole Count
    // --------------------------

    function countHoles(board) {

        let holes = 0;

        for (let r = 1; r < SIZE - 1; r++) {

            for (let c = 1; c < SIZE - 1; c++) {

                if (board[r][c]) continue;

                const around =
                    board[r - 1][c] +
                    board[r + 1][c] +
                    board[r][c - 1] +
                    board[r][c + 1];

                if (around >= 3)
                    holes++;

            }

        }

        return holes;
    }

    // --------------------------
    // Utils
    // --------------------------

    function clone(arr) {
        return arr.map(r => [...r]);
    }

    function permutations(arr) {

        const result = [];

        function backtrack(path, remain) {

            if (!remain.length) {

                result.push(path);
                return;

            }

            remain.forEach((v, i) => {

                const next = [...remain];

                next.splice(i, 1);

                backtrack(
                    [...path, v],
                    next
                );

            });

        }

        backtrack([], arr);

        return result;
    }

    return {
        solve
    };

})();

// Global
window.Solver = Solver;