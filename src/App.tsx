import React, { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag, usePinch } from "@use-gesture/react";
import LifeCard, { DrawType, Scale, Size } from "./LifeCard";
import isMobile from "./isMobile";
import styled from "styled-components";
import { datasets } from "./dataset";
import { noselect } from "./noselect";
import { useWindowSize } from "./useWindowSize";
import colors from "./colors";
import { createUseGesture, dragAction, pinchAction } from "@use-gesture/react";

const useGesture = createUseGesture([pinchAction]);

export default function App() {
  useEffect(() => {
    const handler = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", handler);
    document.addEventListener("gesturechange", handler);
    document.addEventListener("gestureend", handler);
    return () => {
      document.removeEventListener("gesturestart", handler);
      document.removeEventListener("gesturechange", handler);
      document.removeEventListener("gestureend", handler);
    };
  }, []);
  const [style, api] = useSpring(() => ({
    scale: 1,
  }));
  const bind = usePinch(
    ({ last, down, active, canceled, origin: [ox, oy], first, movement: [ms], offset: [s, a], cancel, memo }) => {
      if (s > 2.666) {
        setScale("WEEKS");
      } else if (s > 1.666) {
        setScale("MONTHS");
      } else {
        setScale("YEARS");
      }

      // api.start({ scale: s });
      // if (active) {
      //   api.start({ scale: s });
      // } else {
      //   api.start({ scale: 1 });
      //   // cancel();
      // }
    },
    { scaleBounds: { min: 1, max: 2.7 }, rubberband: true }
  );
  //
  const startDate = datasets.myBirthday;
  const [yearsToShow, setYearsToShow] = useState<number>(90);
  const [scale, setScale] = useState<Scale>("YEARS");
  const windowSize = useWindowSize();
  const getCanvasSize = () => {
    document.documentElement.style.setProperty("--doc-height", `${window.innerHeight}px`);
    const xEdge = 0.95 * Math.min(windowSize.dx, windowSize.dy);
    return { dx: xEdge, dy: xEdge };
  };
  const [drawStyle, setDrawStyle] = useState<DrawType>("OK");
  const handleDrawStyleChange = () => {
    if (drawStyle === "OK") {
      setDrawStyle("FUNKY");
    } else {
      setDrawStyle("OK");
    }
  };

  const handleYearsToShowChange = () => {
    if (yearsToShow === 90) {
      setYearsToShow(35);
    } else {
      setYearsToShow(90);
    }
  };
  //"WEEKS" | "MONTHS" | "YEARS";
  return (
    <Container isMobile={isMobile()}>
      <animated.div {...bind()} style={style}>
        <LifeContainer onClick={handleDrawStyleChange}>
          <LifeCard
            startDate={startDate}
            yearsToShow={yearsToShow}
            scale={scale}
            intervals={scale === "YEARS" ? datasets.allMyLife : datasets.authoring}
            canvasSizePx={getCanvasSize()}
            strokeColor={colors.stroke}
            style={{}}
            drawStyle={drawStyle}
          />
        </LifeContainer>
      </animated.div>
      <Title canvasSize={getCanvasSize()}>
        A{" "}
        <ScaleButton isActive={true} isMobile={isMobile()} onClick={handleYearsToShowChange}>
          {yearsToShow}
        </ScaleButton>
        -Year Life in{" "}
        <ScaleButton isActive={scale === "YEARS"} isMobile={isMobile()} onClick={() => setScale("YEARS")}>
          {"[yrs"}
        </ScaleButton>
        <ScaleButton isActive={scale === "MONTHS"} isMobile={isMobile()} onClick={() => setScale("MONTHS")}>
          {"|mos"}
        </ScaleButton>
        <ScaleButton isActive={scale === "WEEKS"} isMobile={isMobile()} onClick={() => setScale("WEEKS")}>
          {"|wks]"}
        </ScaleButton>
      </Title>
    </Container>
  );
}

const Container = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex: 1;
  height: var(--doc-height);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: ${colors.background};
`;

const Title = styled.text<{ canvasSize: Size }>`
  ${noselect}
  font-weight: bolder;
  font-size: larger;
  position: absolute;
  top: 24px;
  padding: 8px;
  left: ${(props) => (window.innerWidth - props.canvasSize.dx) / 2};
  right: ${(props) => (window.innerWidth - props.canvasSize.dx) / 2};

  cursor: pointer;
  color: ${colors.p};
  text-align: center;

  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
`;

const ScaleButton = styled.text<{ isMobile: boolean; isActive: boolean }>`
  font-weight: bolder;
  /* font-size: larger; */
  color: ${colors.buttonText};
  background: ${(props) => (props.isActive ? colors.button : "transparent")};
  &:hover {
    ${(props) => !props.isMobile && `background-color: ${colors.button};`}
  }
  &:active {
    background-color: ${colors.button};
  }
`;

const LifeContainer = styled.div`
  ${noselect}
  /* display: flex; */
  /* flex: 1; */
  /* min-width: 300px; */
  margin-top: 24px;
  /* background-color: ${colors.button}; */
`;
