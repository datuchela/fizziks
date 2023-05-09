import { Square } from "./objects/Square";
import { relativePoint } from "./utils/relativePoint";
import { EngineState } from "./EngineState";

export type Engine = {
	onClickCanvas: (clientX: number, clientY: number) => void;
};

const DEFAULT_CANVAS_WIDTH = 1280;
const DEFAULT_CANVAS_HEIGHT = 720;

const handleClick =
	(canvas: HTMLCanvasElement, engineState: EngineState) =>
	(clientX: number, clientY: number) => {
		const [x, y] = relativePoint(clientX, clientY, canvas);
		const square = new Square({ x, y, mass: 50 });
		engineState.addObject(square);
	};

export const init = (canvasNode: HTMLCanvasElement) => {
	const engineState = new EngineState();

	let elapsed = 0;
	let oldTimeStamp = 0;

	const canvas = canvasNode;
	const ctx = canvas?.getContext("2d");
	if (!ctx) return;

	canvas.width = DEFAULT_CANVAS_WIDTH;
	canvas.height = DEFAULT_CANVAS_HEIGHT;

	const tick = (timeStamp: number) => {
		elapsed = (timeStamp - oldTimeStamp) / 1000;
		oldTimeStamp = timeStamp;
		elapsed = Math.min(elapsed, 0.1);

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		engineState.detectAndHandleCollisions();
		engineState.detectAndHandleEdgeCollisions(canvas);

		engineState.updateObjects(elapsed);
		engineState.drawObjects(ctx);

		requestAnimationFrame(tick);
	};

	requestAnimationFrame(tick);

	return {
		onClickCanvas: handleClick(canvas, engineState),
	};
};
