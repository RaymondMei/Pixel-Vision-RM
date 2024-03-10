import React, { useState } from "react";

const GameGrid = ({ width, height, colour, boxes, setBoxes }) => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  // Function to toggle the state of a box
  const toggleBox = (row, col) => {
    setBoxes((prevBoxes) => {
      const newBoxes = JSON.parse(JSON.stringify(prevBoxes));
      newBoxes[row][col] = colour;
      return newBoxes;
    });
  };

  //lets users change box color
  const rows = [];
  for (let i = 0; i < height; i++) {
    const cols = [];
    for (let j = 0; j < width; j++) {
      const boxColor = boxes[i][j];
      cols.push(
        <td
          className="gh gw"
          key={j}
          style={{ border: "5px solid black", backgroundColor: boxColor }}
          onMouseDownCapture={() => toggleBox(i, j)}
          onMouseEnter={() => isMouseDown && toggleBox(i, j)}
          onMouseDown={() => setIsMouseDown(true)}
          onMouseUp={() => setIsMouseDown(false)}
        >
          {}
        </td>
      );
    }
    rows.push(<tr key={i}>{cols}</tr>);
  }

  return (
    <table
      className="square100"
      style={{ "table-layout": "fixed", border: "5px solid black" }}
    >
      <tbody>{rows}</tbody>
    </table>
  );
};

export default GameGrid;
