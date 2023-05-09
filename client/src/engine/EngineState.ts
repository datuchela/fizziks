import { Square } from "./objects/Square";
import { rectIntersect } from "./utils/rectIntersect";

export type EngineObject = Square;

export interface EngineState {
	objects: EngineObject[];
	value: string;
	updateObjects: (dt: number) => void;
	drawObjects: (ctx: CanvasRenderingContext2D) => void;
	addObject: (object: EngineObject) => void;
	detectAndHandleCollisions: () => void;
	detectAndHandleEdgeCollisions: (canvas: HTMLCanvasElement) => void;
}

export class EngineState {
	value;
	objects;

	constructor(objects?: EngineObject[]) {
		this.value = "";
		this.objects = objects ?? [];
	}

	updateObjects = (dt: number) => {
		this.objects.forEach((obj) => {
			obj.update(dt);
		});
	};

	drawObjects = (ctx: CanvasRenderingContext2D) => {
		this.objects.forEach((obj) => {
			obj.draw(ctx);
		});
	};

	addObject = (object: EngineObject) => {
		this.objects.push(object);
	};

	detectAndHandleCollisions = () => {
		let obj1;
		let obj2;

		// reset collisions
		this.objects.forEach((obj) => {
			obj.isColliding = false;
		});

		for (let i = 0; i < this.objects.length; i++) {
			obj1 = this.objects[i];
			for (let j = i + 1; j < this.objects.length; j++) {
				obj2 = this.objects[j];
				if (rectIntersect(obj1, obj2)) {
					obj1.isColliding = true;
					obj2.isColliding = true;
				}
			}
		}
	};

	// passing canvas in this method, let's talk about it
	detectAndHandleEdgeCollisions = (canvas: HTMLCanvasElement) => {
		const restitution = 0.9;
		let obj;

		for (let i = 0; i < this.objects.length; i++) {
			obj = this.objects[i];

			// Check for left and right
			if (obj.x < obj.length) {
				obj.vx = Math.abs(obj.vx) * restitution;
				obj.x = obj.length;
			} else if (obj.x > canvas.width - obj.length) {
				obj.vx = -Math.abs(obj.vx) * restitution;
				obj.x = canvas.width - obj.length;
			}

			// Check for bottom and top
			if (obj.y < obj.length) {
				obj.vy = Math.abs(obj.vy) * restitution;
				obj.y = obj.length;
			} else if (obj.y > canvas.height - obj.length / 2) {
				obj.vy = -Math.abs(obj.vy) * restitution;
				obj.y = canvas.height - obj.length / 2;
			}
		}
	};
}
