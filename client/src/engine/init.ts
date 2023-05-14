import { Square } from "./objects/Square";
import { relativePoint } from "./utils/relativePoint";
import { EngineObject, EngineState } from "./EngineState";

export type Engine = {
	onClickCanvas: (clientX: number, clientY: number) => EngineObject;
	spawnObject: (object: EngineObject) => void;
};

const handleClick =
	(canvas: HTMLCanvasElement, engineState: EngineState) =>
	(clientX: number, clientY: number) => {
		const [x, y] = relativePoint(clientX, clientY, canvas);
		const square = new Square({ x, y, mass: 50 });
		engineState.addObject(square);
		return square;
	};

const spawnObject = (engineState: EngineState) => (object: EngineObject) => {
	const square = new Square({ ...object });
	engineState.addObject(square);
};

export const init = (canvas: HTMLCanvasElement) => {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;

	const engineState = new EngineState(canvas.width, canvas.height);

	let elapsed = 0;
	let oldTimeStamp = 0;

	const tick = (timeStamp: number) => {
		elapsed = (timeStamp - oldTimeStamp) / 1000;
		oldTimeStamp = timeStamp;
		elapsed = Math.min(elapsed, 0.1);

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		engineState.detectAndHandleCollisions();
		engineState.detectAndHandleEdgeCollisions();

		engineState.updateObjects(elapsed);
		engineState.drawObjects(ctx);

		requestAnimationFrame(tick);
	};

	requestAnimationFrame(tick);

	return {
		onClickCanvas: handleClick(canvas, engineState),
		spawnObject: spawnObject(engineState),
	};
};
