import { useRef } from "react";

import canvasClasses from "./Canvas.module.css";

const DEFAULT_CANVAS_WIDTH = 1280;
const DEFAULT_CANVAS_HEIGHT = 720;

export const Canvas = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	return (
		<canvas
			ref={canvasRef}
			className={canvasClasses.canvas}
			width={DEFAULT_CANVAS_WIDTH}
			height={DEFAULT_CANVAS_HEIGHT}
		/>
	);
};
