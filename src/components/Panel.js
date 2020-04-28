import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  > *:not(:last-child) {
    margin-right: 16px;
  }
`;

const Panel = ({ rounds, setRounds, diff, setDiff }) => (
  <Container>
    <button
      onClick={() => {
        if (rounds.length >= 2) setRounds(rounds.slice(0, -1));
      }}
      disabled={rounds.length < 2}
    >
      Back
    </button>
    <select
      value={diff.v}
      onChange={(event) => {
        setDiff({ v: event.target.value });
      }}
      disabled={rounds.length > 1}
    >
      <option value={0}>Easy</option>
      <option value={1}>Medium</option>
      <option value={2}>Hard</option>
    </select>
    <button
      onClick={() => {
        setDiff({ ...diff });
      }}
      disabled={rounds.length < 2}
    >
      Reset
    </button>
  </Container>
);

Panel.propTypes = {
  rounds: PropTypes.array.isRequired,
  setRounds: PropTypes.func.isRequired,
  diff: PropTypes.object.isRequired,
  setDiff: PropTypes.func.isRequired,
};

export default Panel;
