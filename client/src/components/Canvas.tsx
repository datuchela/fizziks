import { useEffect, useRef } from "react";
import { socket } from "../App";
import { useObjects } from "../hooks/useObjects";

import { Square } from "../objects/Square";
import { rectIntersect } from "../utils/rectIntersect";
import { relativePoint } from "../utils/relativePoint";

import canvasClasses from "./Canvas.module.css";

const DEFAULT_CANVAS_WIDTH = 1280;
const DEFAULT_CANVAS_HEIGHT = 720;

export const Canvas = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const [objects, setObjects] = useObjects();
	const objectsRef = useRef<Square[]>(objects);

	useEffect(() => {
		objectsRef.current = objects;
	}, [objects]);

	// Listeners
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const handleClick = (e: MouseEvent) => {
			const [x, y] = relativePoint(e.clientX, e.clientY, canvas);
			const square = new Square({ x, y, mass: 50 });
			setObjects((prev) => [...prev, square]);
			socket.emit("spawn-object", { id: square.id, x, y, mass: square.mass });
		};

		socket.on("spawn-object", ({ id, x, y, mass }) => {
			const square = new Square({ id, x, y, mass });
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

		const updateObjects = (dt: number) => {
			objectsRef.current.forEach((obj) => {
				obj.update(dt);
			});
		};

		const detectCollisions = () => {
			let obj1;
			let obj2;

			// reset collisions
			objectsRef.current.forEach((obj) => {
				obj.isColliding = false;
			});

			for (let i = 0; i < objectsRef.current.length; i++) {
				obj1 = objectsRef.current[i];
				for (let j = i + 1; j < objectsRef.current.length; j++) {
					obj2 = objectsRef.current[j];
					if (rectIntersect(obj1, obj2)) {
						obj1.isColliding = true;
						obj2.isColliding = true;
					}
				}
			}
		};

		const detectEdgeCollisions = () => {
			const restitution = 0.9;
			let obj;

			for (let i = 0; i < objectsRef.current.length; i++) {
				obj = objectsRef.current[i];

				// Check for left and right
				if (obj.x < obj.length) {
					obj.vx = Math.abs(obj.vx) * restitution;
					obj.x = obj.length;
				} else if (obj.x > DEFAULT_CANVAS_WIDTH - obj.length) {
					obj.vx = -Math.abs(obj.vx) * restitution;
					obj.x = DEFAULT_CANVAS_WIDTH - obj.length;
				}

				// Check for bottom and top
				if (obj.y < obj.length) {
					obj.vy = Math.abs(obj.vy) * restitution;
					obj.y = obj.length;
				} else if (obj.y > DEFAULT_CANVAS_HEIGHT - obj.length / 2) {
					obj.vy = -Math.abs(obj.vy) * restitution;
					obj.y = DEFAULT_CANVAS_HEIGHT - obj.length / 2;
				}
			}
		};

		const drawObjects = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			objectsRef.current.forEach((obj) => {
				obj.draw(ctx);
			});
		};

		let elapsed = 0;
		let oldTimeStamp = 0;

		const gameLoop = (timeStamp: number) => {
			elapsed = (timeStamp - oldTimeStamp) / 1000;
			oldTimeStamp = timeStamp;
			elapsed = Math.min(elapsed, 0.1);

			updateObjects(elapsed);
			detectCollisions();
			detectEdgeCollisions();
			drawObjects();

			const animationId = requestAnimationFrame(gameLoop);
			return animationId;
		};

		const animationId = gameLoop(elapsed);

		return () => {
			cancelAnimationFrame(animationId);
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
