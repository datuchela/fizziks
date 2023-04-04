import { useEffect, useRef, useState } from "react";
import { socket } from "../App";
import { relativePoint } from "../utils/relativePoint";
import { spawnRect } from "../utils/spawnRect";
import { square } from "../utils/square";

import canvasClasses from "./Canvas.module.css";

const g = 400 * 10;

class Square {
	x;
	y;
	length;
	constructor(x: number, y: number, length: number = 50) {
		this.x = x;
		this.y = y;
		this.length = length;
	}

	draw(ctx: CanvasRenderingContext2D) {
		spawnRect(this.x, this.y, ctx, { width: this.length, height: this.length });
	}

	fall(dt: number) {
		this.y = this.y + (g * square(dt)) / 2;
	}
}

const DEFAULT_CANVAS_WIDTH = 1280;
const DEFAULT_CANVAS_HEIGHT = 720;

export const Canvas = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [objects, setObjects] = useState<Square[]>([]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const handleClick = (e: MouseEvent) => {
			const [x, y] = relativePoint(e.clientX, e.clientY, canvas);
			const square = new Square(x, y);
			setObjects((prev) => [...prev, square]);
			socket.emit("spawn-object", { x, y });
		};

		socket.on("spawn-object", ({ x, y }) => {
			const square = new Square(x, y);
			setObjects((prev) => [...prev, square]);
		});
		canvas.addEventListener("click", handleClick);

		const drawObjects = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			objects.forEach((obj) => {
				obj.draw(ctx);
			});
		};

		const update = (dt: number) => {
			objects.forEach((obj) => {
				console.log(obj.y);
				obj.fall(dt);
			});
		};

		let secondsPassed = 0;
		let oldTimeStamp = 0;

		const gameLoop = (timeStamp: number) => {
			secondsPassed = (timeStamp - oldTimeStamp) / 1000;
			oldTimeStamp = timeStamp;
			secondsPassed = Math.min(secondsPassed, 0.1);

			update(secondsPassed);
			drawObjects();

			requestAnimationFrame(gameLoop);
		};

		gameLoop(secondsPassed);

		return () => {
			socket.off("spawn-object");
			canvas.removeEventListener("click", handleClick);
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
