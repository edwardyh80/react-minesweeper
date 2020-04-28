import React from "react";
import styled from "styled-components";

import Header from "./components/Header";
import GameBoard from "./components/GameBoard";

require("typeface-montserrat");

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const App = () => (
  <Container>
    <Header />
    <GameBoard />
  </Container>
);

export default App;
