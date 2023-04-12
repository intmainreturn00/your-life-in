import { Size } from "./LifeBoard";

const retinaCanvasScaling = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, canvasSizePx: Size) => {
  canvas.style.width = `${canvasSizePx.dx}px`;
  canvas.style.height = `${canvasSizePx.dy}px`;
  const scale = window.devicePixelRatio;
  canvas.width = Math.floor(canvasSizePx.dx * scale);
  canvas.height = Math.floor(canvasSizePx.dy * scale);
  ctx.scale(scale, scale);
};

export default retinaCanvasScaling;
