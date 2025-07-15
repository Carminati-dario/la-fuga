import React, { useState } from "react";
import "./App.css";

function App() {
  const maxCols = 4;
  const maxRows = 5;

  const [block, setBlock] = useState([
    { id: "main", x: 2, y: 1, width: 2, height: 2, color: "red" },
    { id: "tall1", x: 1, y: 1, width: 1, height: 2, color: "blue" },
    { id: "tall2", x: 4, y: 1, width: 1, height: 2, color: "blue" },
    { id: "tall3", x: 2, y: 3, width: 2, height: 1, color: "blue" },
    { id: "tall4", x: 1, y: 3, width: 1, height: 2, color: "blue" },
    { id: "tall5", x: 4, y: 3, width: 1, height: 2, color: "blue" },
    { id: "square1", x: 2, y: 4, width: 1, height: 1, color: "green" },
    { id: "square2", x: 3, y: 4, width: 1, height: 1, color: "green" },
    { id: "square3", x: 2, y: 5, width: 1, height: 1, color: "green" },
    { id: "square4", x: 3, y: 5, width: 1, height: 1, color: "green" },
  ]);

  const [draggedBlock, setDraggedBlock] = useState(null);

  function isOccupied(x, y, width, height, currentBlockId) {
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const cellX = x + i;
        const cellY = y + j;

        // Cerca se c'è già un altro blocco che occupa questa cella
        const cellTaken = block.some((b) => {
          if (b.id === currentBlockId) return false; // ignora se è il blocco stesso
          const withinX = cellX >= b.x && cellX < b.x + b.width;
          const withinY = cellY >= b.y && cellY < b.y + b.height;
          return withinX && withinY;
        });

        if (cellTaken) return true;
      }
    }
    return false;
  }

  const [hasWon, setHasWon] = useState(false);

  const handleMouseDown = (block) => {
    setDraggedBlock(block);
  };

  const handleMouseMove = (e) => {
    if (!draggedBlock) return;

    const gridElement = document.querySelector(".grid");
    const gridRect = gridElement.getBoundingClientRect();

    const mouseX = e.clientX - gridRect.left;
    const mouseY = e.clientY - gridRect.top;

    const cellSize = 65;
    const newX = Math.floor(mouseX / cellSize) + 1;
    const newY = Math.floor(mouseY / cellSize) + 1;

    const deltaX = newX - draggedBlock.x;
    const deltaY = newY - draggedBlock.y;

    if (hasWon) return;

    if (
      draggedBlock.id === "main" &&
      draggedBlock.x === 2 &&
      draggedBlock.y === 4 &&
      deltaX === 0 &&
      deltaY === 1
    ) {
      setHasWon(true);
      alert("You won!");
      return;
    }

    if (
      Math.abs(deltaX) + Math.abs(deltaY) !== 1 ||
      (deltaX !== 0 && deltaY !== 0)
    ) {
      return; // movimento non valido → blocca
    }

    if (
      newX < 1 ||
      newY < 1 ||
      newX + draggedBlock.width - 1 > maxCols ||
      newY + draggedBlock.height - 1 > maxRows
    ) {
      return;
    }

    const isBlocked = isOccupied(
      newX,
      newY,
      draggedBlock.width,
      draggedBlock.height,
      draggedBlock.id,
    );
    if (isBlocked) return;

    setBlock((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === draggedBlock.id ? { ...block, x: newX, y: newY } : block,
      ),
    );
  };

  const handleMouseUp = () => {
    setDraggedBlock(null);
  };

  return (
    <>
      <h1 className="header">La fuga</h1>
      <div
        className="grid"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {block.map((block) => (
          <div
            key={block.id}
            className="block"
            style={{
              gridColumn: `${block.x} / span ${block.width}`,
              gridRow: `${block.y} / span ${block.height}`,
              backgroundColor: block.color,
              cursor: "move",
            }}
            onMouseDown={() => handleMouseDown(block)}
          ></div>
        ))}
      </div>
    </>
  );
}

export default App;
