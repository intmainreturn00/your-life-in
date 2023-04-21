import React, { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { usePinch } from "@use-gesture/react";
import LifeCard, { DrawStyle, Scale, Size } from "./LifeCard";
import isMobile from "./isMobile";
import styled from "styled-components";
import { datasets } from "./dataset";
import { noselect } from "./noselect";
import { useWindowSize } from "./useWindowSize";
import colors from "./colors";

export default function App() {
  useEffect(() => {
    // enabling proper pinch to zoom
    const handler = (e: Event) => {
      e.preventDefault();
    };
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
      if (first) {
        const initialScale = style.scale.get();
        memo = [initialScale];
      }

      if (s > 2.466) {
        setScale("WEEKS");
      } else if (s > 1.466) {
        setScale("MONTHS");
      } else {
        setScale("YEARS");
      }
      if (active) {
        api.start({ scale: memo[0] * ms });
      } else {
        api.start({ scale: 1 });
      }
      return memo;
    },
    {
      scaleBounds: { min: 1, max: 2.6 },
      rubberband: false,
      pointer: { touch: true },
      eventOptions: { passive: false },
    }
  );

  const startDate = datasets.myBirthday;
  const [yearsToShow, setYearsToShow] = useState<number>(100);
  const [scale, setScale] = useState<Scale>("YEARS");
  const windowSize = useWindowSize();
  const getCanvasSize = () => {
    document.documentElement.style.setProperty("--doc-height", `${window.innerHeight}px`);
    if (isMobile()) {
      if (scale === "YEARS") {
        return { dx: 0.7 * Math.min(windowSize.dx, windowSize.dy), dy: 0.7 * Math.min(windowSize.dx, windowSize.dy) };
      } else {
        return { dx: windowSize.dx * 0.9, dy: windowSize.dy * 0.9 };
      }
    } else {
      if (scale === "YEARS") {
        const xEdge = 0.4 * Math.min(windowSize.dx, windowSize.dy);
        return { dx: xEdge, dy: xEdge };
      } else {
        return { dx: Math.min(windowSize.dx, windowSize.dy) * 0.8, dy: windowSize.dy * 0.9 };
      }
    }
  };
  const [drawStyle, setDrawStyle] = useState<DrawStyle>("OK");
  const handleDrawStyleChange = () => {
    if (drawStyle === "OK") {
      setDrawStyle("FUNKY");
    } else {
      setDrawStyle("OK");
    }
  };

  const handleYearsToShowChange = () => {
    if (yearsToShow === 100) {
      setYearsToShow(50);
    } else {
      setYearsToShow(100);
    }
  };
  return (
    <Container isMobile={isMobile()}>
      <animated.div {...bind()} style={style}>
        <LifeContainer onClick={handleDrawStyleChange}>
          <LifeCard
            startDate={startDate}
            yearsToShow={yearsToShow}
            scale={scale}
            intervals={scale === "YEARS" ? datasets.authoring : datasets.authoring}
            canvasSizePx={getCanvasSize()}
            strokeColor={colors.stroke}
            style={{}}
            drawStyle={drawStyle}
          />
        </LifeContainer>
      </animated.div>
      <Title /*hide={scale !== "YEARS" && isMobile()}*/ hide={false} canvasSize={getCanvasSize()} drawStyle={drawStyle}>
        A
        <ScaleButton isActive={true} isMobile={isMobile()} onClick={handleYearsToShowChange}>
          {yearsToShow}
        </ScaleButton>
        -Year Life in [
        <ScaleButton isActive={scale === "YEARS"} isMobile={isMobile()} onClick={() => setScale("YEARS")}>
          {"yrs,"}
        </ScaleButton>
        <ScaleButton isActive={scale === "MONTHS"} isMobile={isMobile()} onClick={() => setScale("MONTHS")}>
          {"mos,"}
        </ScaleButton>
        <ScaleButton isActive={scale === "WEEKS"} isMobile={isMobile()} onClick={() => setScale("WEEKS")}>
          {"wks"}
        </ScaleButton>
        ]
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

const Title = styled.text<{ canvasSize: Size; drawStyle: DrawStyle; hide: boolean }>`
  ${noselect}
  font-family: 'Nova Oval', cursive;
  font-weight: bold;
  /* font-size: large; */
  /* font-size: ${(props) => (props.drawStyle === "FUNKY" ? "larger" : "large")}; */
  position: absolute;
  bottom: 48px;
  left: ${(props) => (window.innerWidth - props.canvasSize.dx) / 2};
  right: ${(props) => (window.innerWidth - props.canvasSize.dx) / 2};
  cursor: pointer;
  color: ${colors.p};
  text-align: center;
  visibility: ${(props) => (props.hide ? "hidden" : "")};
`;

const ScaleButton = styled.text<{ isMobile: boolean; isActive: boolean }>`
  /* font-weight: bolder; */
  /* font-size: larger; */
  padding: 2px;
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
  /* min-width: 300px; */
  /* display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center; */
  /* margin-top: 24px; */
  /* background-color: ${colors.button}; */
  padding: 8px;
  border-radius: 4px;
  /* 
  box-shadow: inset -5px -5px 10px 0px rgba(255, 255, 255, 0.5), inset 5px 5px 10px 0px rgba(0, 0, 0, 0.3); */
  /* padding-left: 8px; */
  /* padding-right: 8px; */
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px,
    rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
`;
