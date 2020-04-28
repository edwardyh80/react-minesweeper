import React from "react";
import styled from "styled-components";

const Container = styled.header`
  text-align: center;
`;

const Header = () => (
  <Container>
    <h1>React Minesweeper</h1>
  </Container>
);

export default Header;
