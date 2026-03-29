/**
 * React Entry Point
 * - Boots up the React application
 * - Mounts the App component to the 'root' div in index.html
 */
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css"; // Global styles and Tailwind imports

// Create the concurrent React root and render the application
createRoot(document.getElementById("root")!).render(<App />);
