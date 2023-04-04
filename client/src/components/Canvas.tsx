import { useEffect, useRef } from "react";
import { socket } from "../App";
import { relativePoint } from "../utils/relativePoint";
import { spawnRect } from "../utils/spawnRect";

import canvasClasses from "./Canvas.module.css";

const DEFAULT_CANVAS_WIDTH = 1280;
const DEFAULT_CANVAS_HEIGHT = 720;

export const Canvas = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const handleClick = (e: MouseEvent) => {
			const [x, y] = relativePoint(e.clientX, e.clientY, canvas);
			spawnRect(x, y, ctx);
			socket.emit("spawn-object", { x, y });
		};

		socket.on("spawn-object", ({ x, y }) => spawnRect(x, y, ctx));
		canvas.addEventListener("click", handleClick);

		return () => {
			socket.off("spawn-object");
			canvas.removeEventListener("click", handleClick);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className={canvasClasses.canvas}
			width={DEFAULT_CANVAS_WIDTH}
			height={DEFAULT_CANVAS_HEIGHT}
		/>
	);
};
