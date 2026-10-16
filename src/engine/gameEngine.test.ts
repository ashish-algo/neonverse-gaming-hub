import {
  createBoard,
  getCanonicalGroupId,
  initializeGameState,
  makeMove,
  undoMove,
} from './gameEngine';

interface TestResult {
  name: string;
  passed: boolean;
  message?: string;
}

export function runEngineTests(): { passed: boolean; results: TestResult[] } {
  const results: TestResult[] = [];

  function assert(name: string, condition: boolean, message?: string) {
    results.push({
      name,
      passed: condition,
      message: condition ? undefined : message || 'Assertion failed',
    });
  }

  // Test 1: Horizontal three-in-a-row scoring
  {
    let state = initializeGameState(4);
    // P1 (X): (0,0), P2 (O): (1,0)
    state = makeMove(state, 0, 0)!.nextState;
    state = makeMove(state, 1, 0)!.nextState;
    // P1 (X): (0,1), P2 (O): (1,1)
    state = makeMove(state, 0, 1)!.nextState;
    state = makeMove(state, 1, 1)!.nextState;
    // P1 (X): (0,2) completes 3 in a row
    const res = makeMove(state, 0, 2)!;
    state = res.nextState;

    assert(
      'Horizontal 3-in-a-row awards exactly 1 point to Player 1',
      state.player1Score === 1 &&
        state.player2Score === 0 &&
        res.pointsEarned === 1 &&
        res.newlyScored.length === 1 &&
        res.newlyScored[0].direction === 'horizontal'
    );
  }

  // Test 2: Vertical three-in-a-row scoring
  {
    let state = initializeGameState(4);
    // P1 (X): (0,0), P2 (O): (0,1)
    state = makeMove(state, 0, 0)!.nextState;
    state = makeMove(state, 0, 1)!.nextState;
    // P1 (X): (1,0), P2 (O): (1,1)
    state = makeMove(state, 1, 0)!.nextState;
    state = makeMove(state, 1, 1)!.nextState;
    // P1 (X): (2,0) completes vertical
    const res = makeMove(state, 2, 0)!;
    state = res.nextState;

    assert(
      'Vertical 3-in-a-row awards 1 point with direction vertical',
      state.player1Score === 1 &&
        res.newlyScored[0].direction === 'vertical' &&
        res.pointsEarned === 1
    );
  }

  // Test 3: Main diagonal scoring
  {
    let state = initializeGameState(4);
    // P1: (0,0), P2: (0,1)
    state = makeMove(state, 0, 0)!.nextState;
    state = makeMove(state, 0, 1)!.nextState;
    // P1: (1,1), P2: (0,2)
    state = makeMove(state, 1, 1)!.nextState;
    state = makeMove(state, 0, 2)!.nextState;
    // P1: (2,2) completes main diagonal
    const res = makeMove(state, 2, 2)!;
    state = res.nextState;

    assert(
      'Main diagonal awards 1 point with direction main-diagonal',
      state.player1Score === 1 &&
        res.newlyScored[0].direction === 'main-diagonal'
    );
  }

  // Test 4: Anti-diagonal scoring
  {
    let state = initializeGameState(4);
    // P1: (0,2), P2: (0,0)
    state = makeMove(state, 0, 2)!.nextState;
    state = makeMove(state, 0, 0)!.nextState;
    // P1: (1,1), P2: (0,1)
    state = makeMove(state, 1, 1)!.nextState;
    state = makeMove(state, 0, 1)!.nextState;
    // P1: (2,0) completes anti-diagonal
    const res = makeMove(state, 2, 0)!;
    state = res.nextState;

    assert(
      'Anti-diagonal awards 1 point with direction anti-diagonal',
      state.player1Score === 1 &&
        res.newlyScored[0].direction === 'anti-diagonal'
    );
  }

  // Test 5: Four matching symbols in a row produce 2 points total
  {
    let state = initializeGameState(5);
    // P1: (0,0), P2: (4,0)
    state = makeMove(state, 0, 0)!.nextState;
    state = makeMove(state, 4, 0)!.nextState;
    // P1: (0,1), P2: (4,1)
    state = makeMove(state, 0, 1)!.nextState;
    state = makeMove(state, 4, 3)!.nextState;
    // P1: (0,2) -> scores 1st group (0,0 - 0,1 - 0,2)
    state = makeMove(state, 0, 2)!.nextState;
    assert('3-in-a-row is 1 point', state.player1Score === 1);
    // P2: (3,4)
    state = makeMove(state, 3, 4)!.nextState;
    // P1: (0,3) -> scores 2nd group (0,1 - 0,2 - 0,3)
    const res = makeMove(state, 0, 3)!;
    state = res.nextState;

    assert(
      '4 matching symbols produce 2 points total (2 overlapping triplets)',
      state.player1Score === 2 &&
        res.pointsEarned === 1 &&
        state.scoredGroups.length === 2
    );
  }

  // Test 6: Five matching symbols in a row produce 3 points total
  {
    let state = initializeGameState(6);
    // Set up 0,0; 0,1; 0,2; 0,3; 0,4 for P1, P2 plays scattered
    state = makeMove(state, 0, 0)!.nextState; // P1
    state = makeMove(state, 5, 0)!.nextState; // P2
    state = makeMove(state, 0, 1)!.nextState; // P1
    state = makeMove(state, 5, 2)!.nextState; // P2
    state = makeMove(state, 0, 2)!.nextState; // P1 (+1 point)
    state = makeMove(state, 5, 4)!.nextState; // P2
    state = makeMove(state, 0, 3)!.nextState; // P1 (+1 point = 2)
    state = makeMove(state, 4, 1)!.nextState; // P2
    const res = makeMove(state, 0, 4)!; // P1 (+1 point = 3)
    state = res.nextState;

    assert(
      '5 matching symbols produce 3 points total along one line',
      state.player1Score === 3 && state.scoredGroups.length === 3
    );
  }

  // Test 7: Multiple groups completed by one move (cross intersection)
  {
    let state = initializeGameState(5);
    // We want P1 to place at (2,2) completing BOTH horizontal (2,0), (2,1), (2,2)
    // AND vertical (0,2), (1,2), (2,2).
    // P1: (2,0)
    state = makeMove(state, 2, 0)!.nextState;
    // P2: (4,0)
    state = makeMove(state, 4, 0)!.nextState;
    // P1: (2,1)
    state = makeMove(state, 2, 1)!.nextState;
    // P2: (4,1)
    state = makeMove(state, 4, 1)!.nextState;
    // P1: (0,2)
    state = makeMove(state, 0, 2)!.nextState;
    // P2: (4,2)
    state = makeMove(state, 4, 2)!.nextState;
    // P1: (1,2)
    state = makeMove(state, 1, 2)!.nextState;
    // P2: (4,3)
    state = makeMove(state, 4, 3)!.nextState;

    // P1 now places at (2,2)! Should complete horizontal and vertical simultaneously!
    const res = makeMove(state, 2, 2)!;
    state = res.nextState;

    assert(
      'Move completing horizontal and vertical simultaneously awards 2 points in one turn',
      res.pointsEarned === 2 &&
        res.newlyScored.length === 2 &&
        state.player1Score === 2
    );
  }

  // Test 8: Previously scored groups are never scored twice
  {
    let state = initializeGameState(3);
    state = makeMove(state, 0, 0)!.nextState; // P1
    state = makeMove(state, 1, 0)!.nextState; // P2
    state = makeMove(state, 0, 1)!.nextState; // P1
    state = makeMove(state, 1, 1)!.nextState; // P2
    state = makeMove(state, 0, 2)!.nextState; // P1 (scores (0,0)-(0,1)-(0,2)) -> 1 point
    const scoreAfterFirstScore = state.player1Score;

    // Other moves made
    state = makeMove(state, 2, 0)!.nextState; // P2
    state = makeMove(state, 2, 2)!.nextState; // P1

    const duplicateGroup = state.scoredGroups.filter(
      (g) =>
        g.id ===
        getCanonicalGroupId([
          { row: 0, col: 0 },
          { row: 0, col: 1 },
          { row: 0, col: 2 },
        ])
    );

    assert(
      'Previously scored group is not scored twice and appears once in scoredGroups',
      scoreAfterFirstScore === 1 && duplicateGroup.length === 1
    );
  }

  // Test 9: Mixed symbols do not score
  {
    let state = initializeGameState(3);
    state = makeMove(state, 0, 0)!.nextState; // P1 (X)
    state = makeMove(state, 0, 1)!.nextState; // P2 (O)
    const res = makeMove(state, 0, 2)!; // P1 (X)
    state = res.nextState;

    assert(
      'Mixed row [X, O, X] does not score any points',
      state.player1Score === 0 && state.player2Score === 0 && res.pointsEarned === 0
    );
  }

  // Test 10: Occupied cells cannot be overwritten
  {
    let state = initializeGameState(3);
    state = makeMove(state, 0, 0)!.nextState;
    const invalidMove = makeMove(state, 0, 0);

    assert(
      'Attempting to play in occupied cell returns null and does not alter board',
      invalidMove === null && state.board[0][0].symbol === 'X'
    );
  }

  // Test 11: Rapid taps / turns alternate correctly
  {
    let state = initializeGameState(3);
    assert('Starts with Player 1', state.currentPlayer === 1);
    state = makeMove(state, 0, 0)!.nextState;
    assert('Alternates to Player 2', state.currentPlayer === 2);
    state = makeMove(state, 0, 1)!.nextState;
    assert('Alternates back to Player 1', state.currentPlayer === 1);
  }

  // Test 12: Undo move reverses points, marks, and turn
  {
    let state = initializeGameState(3);
    state = makeMove(state, 0, 0)!.nextState; // P1
    state = makeMove(state, 1, 0)!.nextState; // P2
    state = makeMove(state, 0, 1)!.nextState; // P1
    state = makeMove(state, 1, 1)!.nextState; // P2
    state = makeMove(state, 0, 2)!.nextState; // P1 scores (+1 point)
    assert('P1 score is 1 before undo', state.player1Score === 1);
    assert('scoredGroups length is 1 before undo', state.scoredGroups.length === 1);

    // Undo P1's scoring move
    state = undoMove(state);
    assert(
      'Undo correctly reverts score, scoredGroups, board cell, and hands turn back to P1',
      state.player1Score === 0 &&
        state.scoredGroups.length === 0 &&
        state.board[0][2].symbol === null &&
        state.currentPlayer === 1 &&
        state.filledCells === 4
    );
  }

  // Test 13: Game completion when board is full and winner detection
  {
    let state = initializeGameState(3);
    // 3x3 board has 9 cells. Fill all 9:
    // (0,0)=X, (0,1)=O, (0,2)=X
    // (1,0)=O, (1,1)=X, (1,2)=O
    // (2,0)=X, (2,1)=O, (2,2)=X
    // Let's execute move by move:
    const moves: [number, number][] = [
      [0, 0], // X
      [0, 1], // O
      [0, 2], // X
      [1, 0], // O
      [1, 1], // X - main diagonal (0,0),(1,1),(2,2) will complete later, anti-diagonal (0,2),(1,1),(2,0)
      [1, 2], // O
      [2, 0], // X - completes anti-diag (0,2),(1,1),(2,0)! +1 for X
      [2, 1], // O
      [2, 2], // X - completes main diag (0,0),(1,1),(2,2)! +1 for X
    ];

    for (const [r, c] of moves) {
      state = makeMove(state, r, c)!.nextState;
    }

    assert(
      'Game terminates only when full (9 cells), detects winner or draw',
      state.isGameOver === true &&
        state.filledCells === 9 &&
        state.player1Score >= 1 &&
        state.winner !== null
    );
  }

  const allPassed = results.every((r) => r.passed);
  return { passed: allPassed, results };
}
