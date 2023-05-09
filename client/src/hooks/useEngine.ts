import { useEffect, useRef } from "react";
import { init, type Engine } from "../engine/init";

export const useEngine = () => {
	const canvasRef = useRef(null);
	const engineState = useRef<Engine>();

	useEffect(() => {
		if (canvasRef.current) {
			const engine = init(canvasRef.current);

			if (engine) {
				engineState.current = engine;
			}
		}
	}, [canvasRef]);

	const handleClick = (e: React.MouseEvent) => {
		engineState.current?.onClickCanvas(e.clientX, e.clientY);
	};

	return { canvasRef, handleClick };
};
