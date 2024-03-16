export const initializeGameGrid = (gridSize = 3) => {
  const colors = ["red", "green", "yellow", "blue", "black"];

  const grid = [];
  for (let i = 0; i < gridSize; i++) {
    const column = [];
    for (let j = 0; j < gridSize; j++) {
      column.push(Math.floor(Math.random() * colors.length));
    }
    grid.push(column);
  }
  return grid;
};
