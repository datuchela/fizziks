import { useEffect } from "react";
import { socket } from "../App";
import { EngineObject } from "../engine/EngineState";
import { useEngine } from "../hooks/useEngine";

import canvasClasses from "./Canvas.module.css";

const DEFAULT_CANVAS_WIDTH = 1280;
const DEFAULT_CANVAS_HEIGHT = 720;

export const Canvas = () => {
	const { canvasRef, handleClick, spawnObject } = useEngine({ socket: socket });

	useEffect(() => {
		socket.on("spawn-object", (obj: EngineObject) => {
			spawnObject(obj);
		});

		return () => {
			socket.off("spawn-object");
		};
	}, []);

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
