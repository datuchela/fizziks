import { useRef } from "react";

const DEFAULT_CANVAS_WIDTH = 800;
const DEFAULT_CANVAS_HEIGHT = 600;

export const Canvas = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	return (
		<canvas
			ref={canvasRef}
			width={DEFAULT_CANVAS_WIDTH}
			height={DEFAULT_CANVAS_HEIGHT}
		/>
	);
};
