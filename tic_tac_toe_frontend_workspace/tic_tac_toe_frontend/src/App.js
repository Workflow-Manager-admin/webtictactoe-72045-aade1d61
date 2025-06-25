import React, { useState, useEffect } from "react";
import "./App.css";

// Color palette
const COLORS = {
  primary: "#2D9CDB",
  secondary: "#56CCF2",
  accent: "#EB5757",
  background: "#ffffff",
  tile: "#F8F9FA",
  boardLine: "#E9ECEF"
};

// Square component for each cell
function Square({ value, onClick, highlight }) {
  return (
    <button
      className="ttt-square"
      style={{
        color: value === "X" ? COLORS.primary : (value === "O" ? COLORS.accent : COLORS.primary),
        background: highlight ? COLORS.secondary : COLORS.tile,
        borderColor: COLORS.boardLine
      }}
      onClick={onClick}
      aria-label={value ? `Cell with ${value}` : "Empty cell"}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function App() {
  // Game state: 0-8 = squares, X goes first
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winnerInfo, setWinnerInfo] = useState({ winner: null, line: null });
  const [gameOver, setGameOver] = useState(false);

  // Calculate winner on each move
  useEffect(() => {
    const info = calculateWinner(squares);
    setWinnerInfo(info);
    setGameOver(!!info.winner || squares.every(Boolean));
  }, [squares]);

  // PUBLIC_INTERFACE
  function handleClick(i) {
    if (squares[i] || winnerInfo.winner) return;
    const next = squares.slice();
    next[i] = xIsNext ? "X" : "O";
    setSquares(next);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinnerInfo({ winner: null, line: null });
    setGameOver(false);
  }

  // PUBLIC_INTERFACE
  function renderSquare(i) {
    const highlight =
      winnerInfo.line && winnerInfo.line.includes(i)
        ? true
        : false;
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => handleClick(i)}
        highlight={highlight}
      />
    );
  }

  // PUBLIC_INTERFACE
  function statusMessage() {
    if (winnerInfo.winner) {
      return (
        <>
          <span className="status-winner">{winnerInfo.winner} wins!</span>
        </>
      );
    }
    if (gameOver && !winnerInfo.winner) {
      return <span className="status-draw">Draw!</span>;
    }
    return (
      <span>
        Next turn:
        <span
          style={{
            color: xIsNext ? COLORS.primary : COLORS.accent,
            fontWeight: 600,
            marginLeft: 6
          }}
        >
          {xIsNext ? "X" : "O"}
        </span>
      </span>
    );
  }

  return (
    <div className="ttt-app" data-theme="light">
      <header className="ttt-header">
        <h1 className="ttt-title">Tic Tac Toe</h1>
      </header>
      <main className="ttt-main">
        <div className="ttt-status">{statusMessage()}</div>
        <div className="ttt-board-container">
          <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
            {Array(3)
              .fill(null)
              .map((_, row) => (
                <div className="ttt-board-row" key={row}>
                  {Array(3)
                    .fill(null)
                    .map((_, col) => renderSquare(row * 3 + col))}
                </div>
              ))}
          </div>
        </div>
        <button className="ttt-reset-btn" onClick={handleReset}>
          Reset Game
        </button>
      </main>
      <footer className="ttt-footer">
        <span className="ttt-footer-text">
          &copy; {new Date().getFullYear()} Tic Tac Toe
        </span>
      </footer>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Calculates the game winner, if any.
 * @param {Array} squares - Current board state (array of 9).
 * @returns {Object} - { winner: "X"|"O"|null, line: [cell indices]|null }
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6] // diagonals
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line };
    }
  }
  return { winner: null, line: null };
}

export default App;
