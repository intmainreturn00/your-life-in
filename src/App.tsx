import React, { useMemo, useState } from "react";
import LifeBoard, { Scale } from "./LifeBoard";
import isMobile from "./isMobile";
import styled from "styled-components";
import { datasets } from "./dataset";
import { noselect } from "./noselect";
import { Draw, NormalDraw, DiamondDraw, RoughDraw } from "./drawings";
// import { drawPrimitives } from "./drawPrimitives";

export default function App() {
  const startDate = datasets.myBirthday;
  const [yearsToShow, setYearsToShow] = useState<number>(90);
  const [scale, setScale] = useState<Scale>("YEARS");
  const intervals = datasets.authoring;
  const normalDraw = useMemo(() => new NormalDraw(), []);
  // const diamondDraw = useMemo(() => new DiamondDraw(), []);
  const roughDraw = useMemo(() => new RoughDraw(), []);
  const [drawer, setDrawer] = useState<Draw>(normalDraw);

  const handleDrawerChange = () => {
    if (drawer === normalDraw) {
      setDrawer(roughDraw);
    } else if (drawer === roughDraw) {
      setDrawer(normalDraw);
    }
  };
  const handleZoomChange = () => {
    if (scale === "YEARS") {
      setScale("MONTHS");
    } else if (scale === "MONTHS") {
      setScale("WEEKS");
    } else {
      setScale("YEARS");
    }
  };
  const handleYearsToShowChange = () => {
    if (yearsToShow === 90) {
      setYearsToShow(60);
    } else {
      setYearsToShow(90);
    }
  };
  return (
    <Container isMobile={isMobile()}>
      <Title>
        A{" "}
        <ScaleButton isMobile={isMobile()} onClick={handleYearsToShowChange}>
          {yearsToShow}
        </ScaleButton>
        -Year Life in
        <ScaleButton isMobile={isMobile()} onClick={handleZoomChange}>
          {scale}
        </ScaleButton>
      </Title>
      <LifeContainer onClick={handleDrawerChange}>
        <LifeBoard
          startDate={startDate}
          yearsToShow={yearsToShow}
          scale={scale}
          intervals={intervals}
          canvasSizePx={{ dx: 330, dy: scale === "YEARS" ? 330 : 560 }}
          strokeColor={"hotpink"}
          style={{ margin: scale === "YEARS" ? 20 : 5 }}
          draw={drawer}
        />
      </LifeContainer>
    </Container>
  );
}

const Container = styled.div<{ isMobile: boolean }>`
  min-height: 100vh;
  /* mobile viewport bug fix */
  min-height: -webkit-fill-available;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 1rem;
  overflow: hidden;
`;

const Title = styled.text`
  ${noselect}
  margin-top: 1rem;
  cursor: pointer;
  color: hotpink;
  font-weight: bolder;
  font-size: larger;
`;

const ScaleButton = styled.text<{ isMobile: boolean }>`
  font-weight: bolder;
  font-size: larger;
  background-color: aquamarine;
  padding: 0.2rem;
  &:hover {
    ${(props) => !props.isMobile && "color: aquamarine; background-color: hotpink; "}
  }
  &:active {
    color: aquamarine;
    background-color: hotpink;
  }
`;

const LifeContainer = styled.div`
  ${noselect}
  margin-top: 0.5rem;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
`;
