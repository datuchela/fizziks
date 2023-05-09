type SpawnRectOptions = {
	width?: number;
	height?: number;
	strokeStyle?: string | CanvasGradient | CanvasPattern;
};

export const spawnRect = (
	x: number,
	y: number,
	ctx: CanvasRenderingContext2D,
	options?: SpawnRectOptions
): void => {
	ctx.strokeStyle = options?.strokeStyle ?? "white";
	const width = options?.width ?? 50;
	const height = options?.height ?? 50;

	const centerX = x - width / 2;
	const centerY = y - height / 2;

	ctx.strokeRect(centerX, centerY, width, height);
};
