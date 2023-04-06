import { spawnRect } from "../utils/spawnRect";

// TODO: Normalize everything to one units.
const g = 400 * 10;

export class Square {
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
		this.y = this.y + (g * dt * dt) / 2;
	}
}
