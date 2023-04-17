import { g } from "../utils/constants";
import { spawnRect } from "../utils/spawnRect";

type SquareConstructorProps = {
	id?: string;
	mass: number;
	x: number;
	y: number;
	vx?: number;
	vy?: number;
	length?: number;
};

export class Square {
	id;
	mass;
	x;
	y;
	vx;
	vy;
	length;
	isColliding = false;

	constructor({
		mass,
		x,
		y,
		vy = 0,
		vx = 0,
		length = 50,
		id,
	}: SquareConstructorProps) {
		this.id = id ?? crypto.randomUUID();
		this.mass = mass;
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.length = length;
	}

	draw(ctx: CanvasRenderingContext2D) {
		spawnRect(this.x, this.y, ctx, {
			width: this.length,
			height: this.length,
			strokeStyle: this.isColliding ? "red" : "white",
		});
	}

	update(dt: number) {
		this.fall(dt);
		this.x += this.vx * dt;
		this.y += this.vy * dt;
	}

	private fall(dt: number) {
		this.vy += dt * g;
	}
}
