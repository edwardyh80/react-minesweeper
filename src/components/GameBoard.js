import React, { useEffect, useState } from "react";
import styled from "styled-components";

import Cell from "./Cell";
import Panel from "./Panel";

const Container = styled.main`
  overflow: auto;
`;

const Table = styled.table`
  margin: auto;
  padding: 8px;
`;

const DIFF = [
  { maxX: 8, maxY: 8, bombCount: 10 },
  { maxX: 16, maxY: 16, bombCount: 40 },
  { maxX: 30, maxY: 16, bombCount: 99 },
];

const clonePresentRound = (rounds) => ({
  status: rounds[rounds.length - 1].status,
  field: rounds[rounds.length - 1].field.map((row) =>
    row.map((cell) => ({ ...cell }))
  ),
});

const getSurroundingCells = ({ x, y }, diff, center) => {
  const { maxX, maxY } = DIFF[diff.v];
  const arr = [-1, 0, 1];
  const result = [];
  arr.forEach((i) => {
    arr.forEach((j) => {
      if (
        (!center || i || j) &&
        y + i >= 0 &&
        y + i < maxY &&
        x + j >= 0 &&
        x + j < maxX
      )
        result.push([y + i, x + j]);
    });
  });
  return result;
};

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const initGameBoard = (diff) => {
  const { maxX, maxY, bombCount } = DIFF[diff.v];
  const field = Array(maxY)
    .fill()
    .map(() =>
      Array(maxX)
        .fill()
        .map(() => ({
          value: 0,
          isBomb: false,
          isFlag: false,
          isRevealed: false,
        }))
    );
  const bombPos = shuffle([...Array(maxX * maxY).keys()])
    .slice(0, bombCount)
    .map((n) => ({ x: n % maxX, y: Math.floor(n / maxX) }));
  bombPos.forEach(({ x, y }) => {
    field[y][x].isBomb = true;
    getSurroundingCells({ x, y }, diff, false).forEach(([newY, newX]) => {
      field[newY][newX].value++;
    });
  });
  return { status: 0, field };
};

const countRevealedCells = (field) =>
  field.reduce(
    (total, row) =>
      (total += row.reduce(
        (rowTotal, cell) => (rowTotal += +(!cell.isBomb && cell.isRevealed)),
        0
      )),
    0
  );

const GameBoard = () => {
  let presentRound;

  const [diff, setDiff] = useState({ v: 0 });
  const [rounds, setRounds] = useState([initGameBoard(diff)]);
  const insertRound = (round) => {
    setRounds((rounds) => rounds.concat([round]));
  };

  useEffect(() => {
    setRounds([initGameBoard(diff)]);
  }, [diff]);

  const clickCell = ({ x, y }, manual) => {
    const { maxX, maxY, bombCount } = DIFF[diff.v];
    if (manual) presentRound = clonePresentRound(rounds);
    if (presentRound.status) return;
    const currentCell = presentRound.field[y][x];
    if (!currentCell.isRevealed && (!manual || !currentCell.isFlag)) {
      currentCell.isRevealed = true;
      currentCell.isFlag = false;
      if (!currentCell.value)
        getSurroundingCells({ x, y }, diff, false).forEach(([newY, newX]) => {
          if (!presentRound.field[newY][newX].isRevealed)
            clickCell({ x: newX, y: newY }, false);
        });
      if (currentCell.isBomb) presentRound.status = -1;
      if (countRevealedCells(presentRound.field) === maxX * maxY - bombCount)
        presentRound.status = 1;
      if (manual) insertRound(presentRound);
    }
  };

  const clickCellAlt = ({ x, y }) => {
    presentRound = clonePresentRound(rounds);
    if (presentRound.status) return;
    const currentCell = presentRound.field[y][x];
    if (!currentCell.isRevealed) {
      currentCell.isFlag = !currentCell.isFlag;
      insertRound(presentRound);
    }
  };

  return (
    <>
      <Panel
        rounds={rounds}
        setRounds={setRounds}
        diff={diff}
        setDiff={setDiff}
        DIFF={DIFF}
      />
      <Container>
        <Table
          onContextMenu={(event) => {
            event.preventDefault();
          }}
        >
          <tbody>
            {rounds[rounds.length - 1].field.map((row, y) => (
              <tr key={`y${y}`}>
                {row.map(({ value, isBomb, isFlag, isRevealed }, x) => (
                  <Cell
                    key={`y${y}x${x}`}
                    value={value}
                    isBomb={isBomb}
                    isFlag={isFlag}
                    isRevealed={isRevealed}
                    status={rounds[rounds.length - 1].status}
                    onClick={() => {
                      clickCell({ x, y }, true);
                    }}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      clickCellAlt({ x, y });
                    }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default GameBoard;
