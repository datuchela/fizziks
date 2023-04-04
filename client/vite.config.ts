import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

//@ts-ignore
import dns from "dns";

dns.setDefaultResultOrder("verbatim");

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
});
