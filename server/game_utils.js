export const initializeGameGrid = (gridSize = 3) => {
  const colors = ["red", "green", "yellow", "blue", "black"];

  const grid = [];
  for (let i = 0; i < gridSize; i++) {
    const column = [];
    for (let j = 0; j < gridSize; j++) {
      // random non-white color
      column.push(colors[Math.floor(Math.random() * colors.length)]);
    }
    grid.push(column);
  }
  return grid;
};

export const calculateScore = (correctGrid, guessGrid) => {
  const gridSize = correctGrid.length;
  let score = 0;
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (correctGrid[i][j] === guessGrid[i][j]) score += 100;
    }
  }
  return score;
};
