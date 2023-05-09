import { useEngine } from "../hooks/useEngine";

import canvasClasses from "./Canvas.module.css";

const DEFAULT_CANVAS_WIDTH = 1280;
const DEFAULT_CANVAS_HEIGHT = 720;

export const Canvas = () => {
	const { canvasRef, handleClick } = useEngine();

	return (
		<button
			onClick={handleClick}
			style={{ all: "initial", cursor: "pointer" }}
		>
			<canvas
				ref={canvasRef}
				className={canvasClasses.canvas}
				width={DEFAULT_CANVAS_WIDTH}
				height={DEFAULT_CANVAS_HEIGHT}
			/>
		</button>
	);
};
