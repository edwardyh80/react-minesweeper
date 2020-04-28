import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Td = styled.td`
  border: 1px solid
    ${({ status }) => {
      if (status === 1) return "rgb(0, 136, 255)";
      if (status === 0) return "rgba(44, 41, 61, 0.2)";
      if (status === -1) return "rgb(219, 51, 36)";
    }};
  border-radius: 2px;
  min-width: 28px;
  height: 28px;
  text-align: center;
  user-select: none;
  background: ${({ isBomb, isRevealed }) =>
    isRevealed ? (isBomb ? "red" : "rgb(197, 194, 214)") : "transparent"};
`;

const getDisp = ({ value, isRevealed, isBomb, isFlag, status }) => {
  if (status === 1) {
    return isBomb ? "🚩" : value ? value : null;
  } else {
    if (isFlag) return "🚩";
    if (!isRevealed) return null;
    if (isBomb) return "💣";
    return value ? value : null;
  }
};

const Cell = ({
  value,
  isBomb,
  isFlag,
  isRevealed,
  status,
  onClick,
  onContextMenu,
}) => (
  <Td
    onClick={onClick}
    onContextMenu={onContextMenu}
    isBomb={isBomb}
    isRevealed={isRevealed}
    status={status}
  >
    {getDisp({ value, isRevealed, isBomb, isFlag, status })}
  </Td>
);

Cell.propTypes = {
  value: PropTypes.number.isRequired,
  isBomb: PropTypes.bool.isRequired,
  isFlag: PropTypes.bool.isRequired,
  isRevealed: PropTypes.bool.isRequired,
  status: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func.isRequired,
};

export default Cell;
