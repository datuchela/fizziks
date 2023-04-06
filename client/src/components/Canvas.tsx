import { useEffect, useRef, useState } from "react";
import { socket } from "../App";
import { useObjects } from "../hooks/useObjects";

import { Square } from "../objects/Square";
import { relativePoint } from "../utils/relativePoint";

import canvasClasses from "./Canvas.module.css";

const DEFAULT_CANVAS_WIDTH = 1280;
const DEFAULT_CANVAS_HEIGHT = 720;

export const Canvas = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [objects, setObjects] = useObjects();

	// Listeners
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const handleClick = (e: MouseEvent) => {
			const [x, y] = relativePoint(e.clientX, e.clientY, canvas);
			const square = new Square({ x, y });
			setObjects((prev) => [...prev, square]);
			socket.emit("spawn-object", { id: square.id, x, y });
		};

		socket.on("spawn-object", ({ id, x, y }) => {
			const square = new Square({ id, x, y });
			setObjects((prev) => [...prev, square]);
		});

		canvas.addEventListener("click", handleClick);

		return () => {
			socket.off("spawn-object");
			canvas.removeEventListener("click", handleClick);
		};
	}, []);

	// Game loop
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const drawObjects = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			objects.forEach((obj) => {
				obj.draw(ctx);
			});
		};

		const update = (dt: number) => {
			objects.forEach((obj) => {
				obj.fall(dt);
			});
		};

		let elapsed = 0;
		let oldTimeStamp = 0;

		const gameLoop = (timeStamp: number) => {
			elapsed = (timeStamp - oldTimeStamp) / 1000;
			oldTimeStamp = timeStamp;
			elapsed = Math.min(elapsed, 0.1);

			update(elapsed);
			drawObjects();

			const animationId = requestAnimationFrame(gameLoop);
			return animationId;
		};

		const animationId = gameLoop(elapsed);

		return () => {
			cancelAnimationFrame(animationId);
		};
	}, [objects]);

	return (
		<canvas
			ref={canvasRef}
			className={canvasClasses.canvas}
			width={DEFAULT_CANVAS_WIDTH}
			height={DEFAULT_CANVAS_HEIGHT}
		/>
	);
};
