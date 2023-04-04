export const relativePoint = (
	x: number,
	y: number,
	canvas: HTMLCanvasElement
): Vector => {
	const rect = canvas.getBoundingClientRect();
	const relativeX = x - rect.left;
	const relativeY = y - rect.top;

	return [relativeX, relativeY];
};
