import { useObjects } from "../hooks/useObjects";

export const SpawnedObjects = () => {
	const [objects, setObjects] = useObjects();

	function handleDeleteObject(id: string) {
		setObjects((prev) => prev.filter((obj) => obj.id !== id));
	}

	return (
		<div>
			<ul>
				{objects.map((obj) => (
					<li key={obj.id}>
						{obj.id}
						<button onClick={() => handleDeleteObject(obj.id)}>Delete</button>
					</li>
				))}
			</ul>
		</div>
	);
};
