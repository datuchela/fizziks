import { spawnRect } from "../utils/spawnRect";

type SquareConstructorProps = {
	x: number;
	y: number;
	length?: number;
	id?: string;
};

// TODO: Normalize everything to one units.
const g = 400 * 10;

export class Square {
	id;
	x;
	y;
	length;

	constructor({ x, y, length = 50, id }: SquareConstructorProps) {
		this.id = id ?? crypto.randomUUID();
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
