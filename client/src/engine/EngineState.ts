import { Square } from "./objects/Square";
import { rectIntersect } from "./utils/rectIntersect";

export type EngineObject = Square;

export enum StateValue {
	paused,
	running,
}

export interface EngineState {
	objects: EngineObject[];
	value: StateValue;
	canvasWidth: number;
	canvasHeight: number;

	updateObjects: (dt: number) => void;
	drawObjects: (ctx: CanvasRenderingContext2D) => void;
	addObject: (object: EngineObject) => void;
	detectAndHandleCollisions: () => void;
	detectAndHandleEdgeCollisions: () => void;
}

export class EngineState {
	value;
	objects;

	constructor(canvasWidth: number, canvasHeight: number, objects?: EngineObject[]) {
		this.value = StateValue.running;
		this.canvasWidth = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.objects = objects ?? [];
	}

	updateObjects = (dt: number) => {
		for (let i = 0; i < this.objects.length; ++i) {
			this.objects[i].update(dt);
		}
	};

	drawObjects = (ctx: CanvasRenderingContext2D) => {
		for (let i = 0; i < this.objects.length; ++i) {
			this.objects[i].draw(ctx);
		}
	};

	addObject = (object: EngineObject) => {
		this.objects.push(object);
	};

	detectAndHandleCollisions = () => {
		let obj1;
		let obj2;

		// reset collisions
		for (let i = 0; i < this.objects.length; ++i) {
			this.objects[i].isColliding = false;
		}

		for (let i = 0; i < this.objects.length; ++i) {
			obj1 = this.objects[i];
			for (let j = i + 1; j < this.objects.length; ++j) {
				obj2 = this.objects[j];
				if (rectIntersect(obj1, obj2)) {
					obj1.isColliding = true;
					obj2.isColliding = true;
				}
			}
		}
	};

	detectAndHandleEdgeCollisions = () => {
		const restitution = 0.9;
		let obj;

		for (let i = 0; i < this.objects.length; ++i) {
			obj = this.objects[i];

			// Check for left and right
			if (obj.x < obj.length) {
				obj.vx = Math.abs(obj.vx) * restitution;
				obj.x = obj.length;
			} else if (obj.x > this.canvasWidth - obj.length) {
				obj.vx = -Math.abs(obj.vx) * restitution;
				obj.x = this.canvasWidth - obj.length;
			}

			// Check for bottom and top
			if (obj.y < obj.length) {
				obj.vy = Math.abs(obj.vy) * restitution;
				obj.y = obj.length;
			} else if (obj.y > this.canvasHeight - obj.length / 2) {
				obj.vy = -Math.abs(obj.vy) * restitution;
				obj.y = this.canvasHeight - obj.length / 2;
			}
		}
	};
}
