/**
 * Static Asset Service
 * - Handles serving the frontend (HTML, JS, CSS, Images) in production
 * - Implements the SPA (Single Page Application) routing fallback
 */
import express, { type Express } from "express";
import fs from "fs";
import path from "path";

/**
 * Configure Express to serve production assets
 * @param app The Express application instance
 */
export function serveStatic(app: Express) {
  // Path to the 'public' folder inside the 'dist' build directory
  const distPath = path.resolve(__dirname, "public");

  // Safety check: Ensure the build actually exists before trying to serve it
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // 1. Serve static files (css, js, images, etc.) normally
  app.use(express.static(distPath));

  /**
   * 2. SPA Fallback Route
   * Since this is a React/Wouter application, all client-side routes (like /services or /contact)
   * must return the 'index.html' file so the browser-side router can take over.
   */
  app.use((_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
