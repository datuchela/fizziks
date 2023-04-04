import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { io } from "socket.io-client";

let socket = io("http://localhost:5000/");

function App() {
	const [count, setCount] = useState(0);

	useEffect(() => {
		socket.on("increment", (newCount: number) => {
			console.log(newCount);
			setCount(newCount);
		});

		return () => {
			socket.off("increment");
		};
	}, []);

	function handleIncrement() {
		setCount((prev) => {
			const newCount = prev + 1;
			socket.emit("increment", newCount);
			return newCount;
		});
	}

	return (
		<div className="App">
			<div>
				<a
					href="https://vitejs.dev"
					target="_blank"
				>
					<img
						src={viteLogo}
						className="logo"
						alt="Vite logo"
					/>
				</a>
				<a
					href="https://reactjs.org"
					target="_blank"
				>
					<img
						src={reactLogo}
						className="logo react"
						alt="React logo"
					/>
				</a>
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<button onClick={handleIncrement}>count is {count}</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</div>
	);
}

export default App;