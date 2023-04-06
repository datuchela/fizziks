import { atom } from "jotai";
import { useAtom } from "jotai/react";
import { Square } from "../objects/Square";

const objectsAtom = atom<Square[]>([]);

export const useObjects = () => useAtom(objectsAtom);
