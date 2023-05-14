import { useEffect, useRef } from "react";
import { init, type Engine } from "../engine/init";
import type { Socket } from "socket.io-client";
import type { EngineObject } from "../engine/EngineState";

export type EngineOptions = {
	socket?: Socket;
};

export const useEngine = (options?: EngineOptions) => {
	const canvasRef = useRef(null);
	const engineState = useRef<Engine>();

	useEffect(() => {
		if (!canvasRef.current) return;
		const engine = init(canvasRef.current);

		if (!engine) return;
		engineState.current = engine;
	}, [canvasRef]);

	const handleClick = (e: React.MouseEvent) => {
		const object = engineState.current?.onClickCanvas(e.clientX, e.clientY);
		options?.socket?.emit("spawn-object", object);
	};

	const spawnObject = (object: EngineObject) => {
		engineState.current?.spawnObject(object);
	};

	return { canvasRef, handleClick, spawnObject };
};
