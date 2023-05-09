import { Square } from "../objects/Square";

export const rectIntersect = (rect1: Square, rect2: Square) => {
	if (
		rect2.x > rect1.length + rect1.x ||
		rect1.x > rect2.length + rect2.x ||
		rect2.y > rect1.length + rect1.y ||
		rect1.y > rect2.length + rect2.y
	) {
		return false;
	}
	return true;
};
